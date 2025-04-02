import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { useEffect, useState } from 'react';
import { fetchDepartments } from '../../store/departmentSlice';
import { employeeService } from '../../services/employee';
import { Stack } from '@mui/system';
import { PieChart } from '@mui/x-charts/PieChart';

export const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { departments, loading, error, pagination } = useSelector(
    (state: RootState) => state.department
  );

  useEffect(() => {
    dispatch(
      fetchDepartments({
        page: 1,
        size: 100,
        sort: 'createdAt',
        order: 'ASC',
        value: '',
      })
    );
  }, [dispatch]);

  const getTotalEmployeeByDepartment = async (id: string): Promise<number> => {
    try {
      const response = await employeeService.getAllEmployeeByDepartment(
        id,
        1,
        10,
        'createdAt',
        'ASC',
        ''
      );
      return response.data.totalCount;
    } catch (error) {
      console.error('Failed to fetch total employees by department:', error);
      return 0; // Trả về 0 nếu có lỗi
    }
  };

  const [departmentData, setDepartmentData] = useState<
    { id: number; value: number; label: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await Promise.all(
        departments.map(async (department, index) => ({
          id: index,
          value: await getTotalEmployeeByDepartment(department._id),
          label: department.name,
        }))
      );
      setDepartmentData(data);
    };

    if (departments.length > 0) {
      fetchData();
    }
  }, [departments]);

  return (
    <Stack width={'0vw'}>
      <PieChart
        width={650}
        height={200}
        legend={{}}
        series={[
          {
            data: departmentData,
          },
        ]}
      />
    </Stack>
  );
};
