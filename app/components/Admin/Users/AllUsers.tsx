'use client';
import React, { FC, useEffect, useState, ChangeEvent } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Button, Typography, Select, MenuItem, Modal, TextField } from '@mui/material';
import { AiOutlineDelete, AiOutlineMail, AiOutlinePlus } from 'react-icons/ai';
import { useTheme } from "next-themes";
import Loader from '../../Loader/Loader';
import { format } from "timeago.js";
import { motion } from "framer-motion";
import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from '@/redux/features/user/userApi';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useDispatch } from 'react-redux';
import { userLoggedIn } from '@/redux/features/auth/authSlice';
import toast from 'react-hot-toast';

// Define types
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  avatar?: {
    url: string;
  };
}

interface UsersResponse {
  users: User[];
}

interface UpdateRoleResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  courses: number;
  created_at: string;
}

interface NewUser {
  email: string;
  role: string;
}

type Props = { isTeam: boolean };

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const dispatch = useDispatch();

  const [openAdd, setOpenAdd] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({ email: '', role: 'user' });
  const [teamUsers, setTeamUsers] = useState<User[]>([]);

  // Get current user data
  const { data: currentUserData } = useLoadUserQuery();
  const currentUser = currentUserData?.user as User | undefined;

  const { isLoading, data, refetch } = useGetAllUsersQuery(undefined, { refetchOnMountOrArgChange: true });
  const [updateUserRole, { isLoading: updating }] = useUpdateUserRoleMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  // Sync initial team list
  useEffect(() => {
    if (data && 'users' in data) {
      const usersData = data as UsersResponse;
      const admins = usersData.users.filter((u: User) => u.role === 'admin');
      setTeamUsers(admins);
    }
  }, [data]);

  // Handle role change with token update
  const handleRoleChange = async (id: string, role: string) => {
    try {
      const result = await updateUserRole({ userId: id, role }).unwrap() as UpdateRoleResponse;
      
      if (result.success) {
        toast.success(`Role updated to ${role}`);
        
        // If updating CURRENT USER, update tokens and state
        if (currentUser?._id === id) {
          // Update cookies with new tokens if provided
          if (result.accessToken) {
            document.cookie = `access_token=${result.accessToken}; path=/; max-age=300; samesite=lax`;
          }
          if (result.refreshToken) {
            document.cookie = `refresh_token=${result.refreshToken}; path=/; max-age=259200; samesite=lax`;
          }
          
          // Update Redux state
          if (result.user) {
            dispatch(userLoggedIn({
              accessToken: result.accessToken || '',
              user: result.user
            }));
          }
          
          toast.success(
            <div>
              <p className="font-bold">🎉 Your role has been updated to <span className="text-blue-400">{role}</span>!</p>
              <p className="text-sm mt-1">Refreshing page to apply changes...</p>
            </div>,
            { duration: 3000 }
          );
          
          // Auto-refresh after 2 seconds
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
        
        // Update local lists
        if (isTeam) {
          if (role === 'admin') {
            const usersData = data as UsersResponse;
            const promotedUser = usersData?.users.find((u: User) => u._id === id);
            if (promotedUser && !teamUsers.find(u => u._id === id)) {
              setTeamUsers([...teamUsers, { ...promotedUser, role }]);
            }
          } else {
            setTeamUsers(teamUsers.filter(u => u._id !== id));
          }
        }
        
        // Refetch fresh data
        setTimeout(() => {
          refetch();
          if (currentUser?._id === id) {
            // Force reload current user data
            window.location.href = window.location.href;
          }
        }, 1000);
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      console.error("Update role error:", err);
      toast.error(err?.data?.message || "Failed to update role");
    }
  };

  // Handle delete user
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("User deleted successfully");
        if (isTeam) setTeamUsers(teamUsers.filter(u => u._id !== id));
        else refetch();
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || "Failed to delete user");
      }
    }
  };

  // Prepare DataGrid rows
  const rows: UserRow[] = [];
  const usersData = data as UsersResponse | undefined;
  const list = isTeam ? teamUsers : usersData?.users || [];
  
  list.forEach((u: User) => {
    rows.push({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      courses: 0, // Default to 0 since courses field is removed
      created_at: format(u.createdAt),
    });
  });

  const columns: GridColDef<UserRow>[] = [
    { field: 'id', headerName: 'ID', flex: 0.6, headerAlign: 'center', align: 'center' },
    { field: 'name', headerName: 'Name', flex: 1.2 },
    { field: 'email', headerName: 'Email', flex: 1.2, headerAlign: 'center', align: 'center' },
    {
      field: 'role',
      headerName: 'Role',
      flex: 0.8,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams<UserRow>) => (
        <Select
          size="small"
          value={params.row.role}
          onChange={(e) => handleRoleChange(params.row.id, e.target.value)}
          disabled={updating}
          sx={{
            color: isDark ? '#f8fafc' : '#1f2937',
            '.MuiSelect-icon': { color: isDark ? '#f8fafc' : '#1f2937' },
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            bgcolor: isDark ? '#1e293b' : '#f8fafc',
            borderRadius: 2,
            height: '36px',
            minWidth: '90px',
            '& .MuiMenuItem-root': { color: isDark ? '#f8fafc' : '#1f2937' },
          }}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      ),
    },
    { field: 'courses', headerName: 'Courses', flex: 0.7, headerAlign: 'center', align: 'center' },
    { field: 'created_at', headerName: 'Joined', flex: 0.8, headerAlign: 'center', align: 'center' },
    {
      field: "mail",
      headerName: 'Mail',
      flex: 0.4,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params: GridRenderCellParams<UserRow>) => (
        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
          <a
            href={`mailto:${params.row.email}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              color: isDark ? '#22d3ee' : '#0ea5e9',
              backgroundColor: isDark ? 'rgba(34,211,238,0.1)' : 'rgba(14,165,233,0.1)',
              transition: 'all 0.2s ease',
            }}
          >
            <AiOutlineMail size={20} />
          </a>
        </motion.div>
      ),
    },
    {
      field: "delete",
      headerName: 'Delete',
      flex: 0.4,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params: GridRenderCellParams<UserRow>) => (
        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={() => handleDelete(params.row.id)}
            disabled={deleting}
            sx={{
              minWidth: '36px',
              borderRadius: '10px',
              color: isDark ? '#f87171' : '#dc2626',
              '&:hover': { backgroundColor: isDark ? 'rgba(248,113,113,0.15)' : 'rgba(220,38,38,0.1)' },
            }}
          >
            <AiOutlineDelete size={20} />
          </Button>
        </motion.div>
      ),
    },
  ];

  // Handle promote member in modal
  const handlePromoteMember = async () => {
    if (!newUser.email) {
      toast.error("Email is required");
      return;
    }

    const usersData = data as UsersResponse | undefined;
    const user = usersData?.users.find((u: User) => u.email === newUser.email);
    if (!user) {
      toast.error("User not found");
      return;
    }

    try {
      const result = await updateUserRole({ userId: user._id, role: newUser.role }).unwrap() as UpdateRoleResponse;
      
      if (result.success) {
        toast.success(newUser.role === 'admin' 
          ? "User promoted to admin!" 
          : "User role updated!");
        
        // If promoting current user, update tokens
        if (currentUser?._id === user._id) {
          if (result.accessToken) {
            document.cookie = `access_token=${result.accessToken}; path=/; max-age=300`;
          }
          if (result.user) {
            dispatch(userLoggedIn({
              accessToken: result.accessToken || '',
              user: result.user
            }));
          }
          
          toast.success(
            <div>
              <p>Your role has been updated! Refreshing page...</p>
            </div>,
            { duration: 3000 }
          );
          
          setTimeout(() => window.location.reload(), 2000);
        }
        
        // Update local state
        if (newUser.role === 'admin') {
          if (!teamUsers.find(u => u._id === user._id)) {
            setTeamUsers([...teamUsers, { ...user, role: 'admin' }]);
          }
        } else {
          setTeamUsers(teamUsers.filter(u => u._id !== user._id));
        }
        
        // Reset modal
        setOpenAdd(false);
        setNewUser({ email: '', role: 'user' });
        
        // Refetch
        setTimeout(() => refetch(), 1000);
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update role");
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, email: e.target.value });
  };

  const handleRoleSelectChange = (e: { target: { value: string } }) => {
    setNewUser({ ...newUser, role: e.target.value });
  };

  return (
    <div
      className="transition-all duration-300"
      style={{
        marginLeft: '270px',
        padding: '100px 2rem 3rem',
        minHeight: '100vh',
        backgroundColor: isDark ? '#0f172a' : '#f8fafc',
        overflowY: 'auto',
      }}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <Box sx={{
          p: 3,
          borderRadius: '16px',
          backdropFilter: 'blur(12px)',
          background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
          boxShadow: isDark ? '0 8px 20px rgba(255,255,255,0.05)' : '0 8px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
        }}>
          {isTeam && (
            <div className="w-full flex justify-end mb-4">
              <Button
                variant="contained"
                onClick={() => setOpenAdd(true)}
                startIcon={<AiOutlinePlus />}
                disabled={updating}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  backdropFilter: 'blur(12px)',
                  background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(95, 217, 245, 0.95)',
                  boxShadow: isDark
                    ? '0 8px 20px rgba(255, 255, 255, 0.05)'
                    : '0 8px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                }}
              >
                Promote Member
              </Button>
            </div>
          )}

          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              textAlign: 'center',
              color: isDark ? '#f8fafc' : '#1f2937',
              letterSpacing: '0.5px',
            }}
          >
            {isTeam ? "Manage Team" : "All Users"} 
            <span className="ml-2 text-sm bg-blue-500 text-white px-2 py-1 rounded">
              {rows.length} users
            </span>
          </Typography>

          <Box sx={{
            width: '100%',
            height: 'auto',
            maxHeight: '80vh',
            overflow: 'auto',
            '& .MuiDataGrid-root': {
              border: 'none',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
              color: isDark ? '#f8fafc' : '#1f2937',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: isDark ? '#1e293b' : '#e5e7eb',
              color: isDark ? '#222527e2' : '#1f2937',
              fontWeight: 600,
              borderBottom: 'none',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: isDark ? '#d6c0fcff' : '#f1f5f9',
              transition: '0.2s ease-in-out',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: 'none',
              color: isDark ? '#282b2eff' : '#1f2937',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: isDark ? '#b1daeaff' : '#e5e7eb',
              borderTop: 'none',
              color: isDark ? '#356594ff' : '#1f2937',
            },
            '& .MuiCheckbox-root': {
              color: isDark ? '#22d3ee !important' : '#0e7490 !important',
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: 'transparent',
            },
          }}>
            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              loading={isLoading || updating || deleting}
              sx={{ borderRadius: '12px', overflow: 'hidden' }}
            />
          </Box>
        </Box>
      )}

      {/* Promote Member Modal */}
      {isTeam && (
        <Modal open={openAdd} onClose={() => setOpenAdd(false)}>
          <Box sx={{
            p: 4,
            backgroundColor: isDark ? '#1e293b' : '#ffffffff',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '400px',
            mx: 'auto',
            mt: '15vh',
            boxShadow: '0 8px 20px rgba(17, 120, 255, 1)',
          }}>
            <Typography variant="h6" mb={2} color={isDark ? '#fff' : '#000'}>
              Promote Member
            </Typography>

            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              margin="dense"
              value={newUser.email}
              onChange={handleEmailChange}
              disabled={updating}
              sx={{
                input: { color: isDark ? '#ffffff' : '#1f2937' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: isDark ? '#f3f3f3ff' : '#ced7e1ff' },
                '& .MuiInputLabel-root': { color: isDark ? '#f8fafc' : '#6b7280' }
              }}
            />

            <Select
              fullWidth
              value={newUser.role}
              onChange={handleRoleSelectChange}
              disabled={updating}
              sx={{ mt: 2, color: isDark ? '#f8fafc' : '#1f2937' }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>

            <Button
              fullWidth
              variant="contained"
              disabled={updating}
              sx={{ mt: 3, background: isDark ? '#22d3ee' : '#0ea5e9' }}
              onClick={handlePromoteMember}
            >
              {updating ? 'Updating...' : 'Submit'}
            </Button>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default AllUsers;