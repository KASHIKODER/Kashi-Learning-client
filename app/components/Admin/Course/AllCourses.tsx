'use client';
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Button, Modal, Typography } from '@mui/material';
import { AiOutlineDelete } from 'react-icons/ai';
import { FiEdit2 } from 'react-icons/fi';
import { useTheme } from "next-themes";
import { useGetAllCoursesQuery, useDeleteCourseMutation } from '@/redux/features/courses/coursesApi';
import Loader from '../../Loader/Loader';
import { format } from "timeago.js";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';
import Link from 'next/link';

// Define types for course data
interface Course {
  _id: string;
  name?: string;
  courseName?: string;
  title?: string;
  ratings?: number;
  purchased?: number;
  createdAt: string;
}

interface CoursesResponse {
  courses: Course[];
}

type CourseRow = {
  id: string;
  _id: string; // backend delete ke liye
  title: string;
  ratings: number;
  purchased: number;
  created_at: string;
};

const AllCourses = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [coursesList, setCoursesList] = useState<CourseRow[]>([]);

  const { isLoading, data } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
  const [deleteCourse] = useDeleteCourseMutation();

  // ✅ Populate local state from query
  useEffect(() => {
    if (data && 'courses' in data) {
      const response = data as CoursesResponse;
      const rows = response.courses.map((item: Course) => ({
        id: item._id,
        _id: item._id,
        title: item.name || item.courseName || item.title || 'Untitled Course',
        ratings: item.ratings || 0,
        purchased: item.purchased || 0,
        created_at: format(item.createdAt),
      }));
      setCoursesList(rows);
    }
  }, [data]);

  // ✅ Delete handler
  const handleDelete = async () => {
    if (!courseId) return toast.error("Invalid course ID");

    try {
      await deleteCourse(courseId).unwrap();
      setCoursesList(prev => prev.filter(c => c._id !== courseId));
      setOpen(false);
      toast.success("Course deleted successfully");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to delete course");
      // ✅ still remove from UI if manual DB deletion caused not found
      setCoursesList(prev => prev.filter(c => c._id !== courseId));
      setOpen(false);
    }
  };

  const columns: GridColDef<CourseRow>[] = [
    { field: 'id', headerName: 'ID', flex: 0.6, headerAlign: 'center', align: 'center' },
    { field: 'title', headerName: 'Course Title', flex: 1.2 },
    { field: 'ratings', headerName: 'Ratings', flex: 0.5, headerAlign: 'center', align: 'center' },
    { field: 'purchased', headerName: 'Purchased', flex: 0.5, headerAlign: 'center', align: 'center' },
    { field: 'created_at', headerName: 'Created At', flex: 0.8, headerAlign: 'center', align: 'center' },
    {
      field: "edit",
      headerName: 'Edit',
      flex: 0.4,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params: GridRenderCellParams<CourseRow>) => (
        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
          <Link href={`/admin/edit-course/${params.row._id}`} passHref>
            <FiEdit2 size={20} />
          </Link>
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
      renderCell: (params: GridRenderCellParams<CourseRow>) => (
        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={() => {
              if (!params.row._id) return toast.error("Invalid course selected");
              setCourseId(params.row._id);
              setOpen(true);
            }}
            sx={{
              minWidth: '40px',
              borderRadius: '10px',
              color: isDark ? '#f87171' : '#dc2626',
              '&:hover': {
                backgroundColor: isDark ? 'rgba(248,113,113,0.15)' : 'rgba(220,38,38,0.1)',
              },
            }}
          >
            <AiOutlineDelete size={20} />
          </Button>
        </motion.div>
      ),
    },
  ];

  return (
    <div
      className="transition-all duration-300"
      style={{
        marginLeft: '270px',
        padding: '100px 2rem 3rem',
        minHeight: '100vh',
        backgroundColor: isDark ? '#0f172a' : '#f8fafc',
        overflowY: 'auto',
        overflowX: 'hidden',
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
            All Courses
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
              rows={coursesList}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              sx={{ borderRadius: '12px', overflow: 'hidden' }}
            />
          </Box>
        </Box>
      )}

      {/* ✅ Delete Confirmation Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            padding: '2rem',
            width: '90%',
            maxWidth: '420px',
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 600,
              textAlign: 'center',
              color: isDark ? '#f8fafc' : '#1f2937',
            }}
          >
            Are you sure you want to delete this course?
          </Typography>

          <Box display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => setOpen(false)}
              sx={{
                color: isDark ? '#22d3ee' : '#0e7490',
                borderColor: isDark ? '#22d3ee' : '#0e7490',
                width: '45%',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDelete}
              sx={{
                backgroundColor: isDark ? '#ef4444' : '#dc2626',
                '&:hover': { backgroundColor: isDark ? '#b91c1c' : '#b91c1c' },
                width: '45%',
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default AllCourses;