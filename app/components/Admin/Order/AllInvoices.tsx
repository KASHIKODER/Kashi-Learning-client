import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Paper, Typography } from "@mui/material";
import { useTheme } from "next-themes";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import { AiOutlineMail } from "react-icons/ai";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";

// Define types
interface User {
  _id: string;
  name: string;
  email: string;
}

interface Course {
  _id: string;
  name: string;
  price: number;
}

interface Order {
  _id: string;
  userId: string;
  courseId: string;
  createdAt: string;
}

interface OrderRow {
  id: string;
  userName: string;
  userEmail: string;
  title: string;
  price: string;
  created_at: string;
}
interface OrdersResponse {
  orders: Order[];
}

interface UsersResponse {
  users: User[];
}

interface CoursesResponse {
  courses: Course[];
}

type Props = {
  isDashboard?: boolean;
};

const AllInvoices = ({ isDashboard }: Props) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { isLoading, data } = useGetAllOrdersQuery({});
  const { data: usersData } = useGetAllUsersQuery();
  const { data: coursesData } = useGetAllCoursesQuery({});
  const [rows, setRows] = useState<OrderRow[]>([]);

  useEffect(() => {
    if (data && usersData && coursesData) {
      const ordersData = data as OrdersResponse;
      const users = usersData as UsersResponse;
      const courses = coursesData as CoursesResponse;

      const tempRows = ordersData.orders.map((item: Order) => {
        const user = users.users.find((u: User) => u._id === item.userId);
        const course = courses.courses.find((c: Course) => c._id === item.courseId);
        return {
          id: item._id,
          userName: user?.name || "Unknown User",
          userEmail: user?.email || "Unknown Email",
          title: course?.name || "Unknown Course",
          price: "$" + (course?.price || 0),
          created_at: format(item.createdAt),
        };
      });
      setRows(tempRows);
    }
  }, [data, usersData, coursesData]);

  const columns: GridColDef<OrderRow>[] = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
    },
    {
      field: "userName",
      headerName: "Name",
      width: 150,
    },

    ...(isDashboard
      ? []
      : [
        {
          field: "userEmail",
          headerName: "Email",
          width: 200,
        },
        {
          field: "title",
          headerName: "Course Title",
          width: 200,
          renderCell: (params: GridRenderCellParams<OrderRow>) => (
            <span className="truncate block">
              {params.row.title}
            </span>
          ),
        },
      ]),

    {
      field: "price",
      headerName: "Price",
      width: 100,
    },

    ...(isDashboard
      ? [{
        field: "created_at",
        headerName: "Created At",
        width: 120,
      }]
      : [
        {
          field: "mail",
          headerName: "Mail",
          width: 80,
          align: "center" as const,
          headerAlign: "center" as const,
          sortable: false,
          filterable: false,
          disableColumnMenu: true,
          renderCell: (params: GridRenderCellParams<OrderRow>) => (
            <a
              href={`mailto:${params.row.userEmail}`}
              className={`
                                  flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
                                  ${isDark
                  ? "bg-blue-600 hover:bg-blue-500 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
                }
                                  hover:scale-105 shadow-md hover:shadow-lg
                              `}
              title="Send Email"
            >
              <AiOutlineMail size={18} />
            </a>
          ),
        },
      ]),
  ];

  const filteredColumns = isDashboard
    ? columns.filter(col =>
      col.field !== "userEmail" &&
      col.field !== "title" &&
      col.field !== "mail"
    )
    : columns;

  return (
    <div className={!isDashboard ? "mt-[120px]" : "mt-[0px]"}>
      {isLoading ? (
        <Loader />
      ) : (
        <Box m={isDashboard ? "0" : "40px"}>
          {!isDashboard && (
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 3,
                textAlign: 'center',
                color: isDark ? '#f8fafc' : '#6ddaffff',
                letterSpacing: '0.5px',
              }}
            >
              All Invoices
            </Typography>
          )}

          <Paper
            elevation={3}
            sx={{
              borderRadius: "16px",
              overflow: "hidden",
              bgcolor: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(95, 217, 245, 0.95)',
              p: isDashboard ? 1 : 2,
              boxShadow: isDark
                ? "0px 4px 20px rgba(255,255,255,0.05)"
                : "0px 4px 25px rgba(0,0,0,0.08)",
              transition: 'all 0.3s ease',
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "80vh",
                overflow: "auto",
                "& .MuiDataGrid-root": {
                  border: "none",
                  outline: "none",
                  fontFamily: "Inter, sans-serif",
                  color: isDark ? "#f8fafc" : "#1f2937",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: isDark ? "#1e293b" : "#e5e7eb",
                  color: isDark ? "#080a0cff" : "#1f2937",
                  fontWeight: 600,
                  borderBottom: "none",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: isDark ? "#c3f4f7cb" : "#f1f5f9",
                  transition: "0.2s ease-in-out",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                  color: isDark ? "#000000ff" : "#1f2937",
                },
                "& .MuiDataGrid-footerContainer": {
                  backgroundColor: isDark ? "#c9daf4ff" : "#e5e7eb",
                  borderTop: "none",
                  color: isDark ? "#f8fafc" : "#1f2937",
                },
                "& .MuiCheckbox-root": {
                  color: isDark ? "#22d3ee !important" : "#0e7490 !important",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <DataGrid
                checkboxSelection={!isDashboard}
                rows={rows}
                columns={filteredColumns}
                disableColumnMenu
                disableRowSelectionOnClick
                slots={isDashboard ? {} : { toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 },
                  },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableColumnSelector={isDashboard}
                disableDensitySelector={isDashboard}
              />
            </Box>
          </Paper>
        </Box>
      )}
    </div>
  );
};

export default AllInvoices;