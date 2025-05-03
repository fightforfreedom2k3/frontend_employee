import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store'; // Adjust path if needed
import { useEffect, useState, useMemo } from 'react';
import {
  fetchProperties /* deleteProperty */,
} from '../../../store/propertySlice'; // Adjust path if needed - Uncomment deleteProperty when implemented
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  CircularProgress,
  Alert,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { convertToVietnamDate } from '../../../lib/formatDateTime';

// const CreatePropertyDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => (/* ... implementation ... */);
// const EditPropertyDialog = ({ open, onClose, property }: { open: boolean; onClose: () => void; property: any | null }) => (/* ... implementation ... */);
// const PropertyDetailDialog = ({ open, onClose, property }: { open: boolean; onClose: () => void; property: any | null }) => (/* ... implementation ... */);

export default function PropertyList() {
  const {
    properties = [],
    loading,
    error,
  } = useSelector((state: RootState) => state.property);
  const dispatch = useDispatch<AppDispatch>();

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const [propertyToDeleteId, setPropertyToDeleteId] = useState<string | null>(
    null
  );

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    return properties.filter(property =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [properties, searchQuery]);

  const paginatedProperties = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredProperties.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredProperties, page, rowsPerPage]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateDialogOpen = () => setCreateDialogOpen(true);
  const handleCreateDialogClose = () => setCreateDialogOpen(false);

  const handleRowClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setDetailDialogOpen(true);
  };
  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
    setSelectedPropertyId(null);
  };

  const handleEditButton = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setEditDialogOpen(true);
  };
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedPropertyId(null);
  };

  const handleDeleteButton = (propertyId: string) => {
    setPropertyToDeleteId(propertyId);
    setConfirmDeleteOpen(true);
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDeleteOpen(false);
    setPropertyToDeleteId(null);
  };

  const handleDeleteConfirm = () => {
    if (propertyToDeleteId) {
      console.log(
        'Dispatching delete action for property:',
        propertyToDeleteId
      );
    }
    handleCloseConfirmDelete();
  };

  // --- Render Logic ---
  const renderContent = () => {
    if (loading) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          Lỗi khi tải dữ liệu cơ sở vật chất:{' '}
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </Alert>
      );
    }

    if (!properties || properties.length === 0) {
      return (
        <Typography sx={{ mt: 3, textAlign: 'center' }}>
          Không có cơ sở vật chất nào trong hệ thống.
        </Typography>
      );
    }

    if (paginatedProperties.length === 0 && searchQuery !== '') {
      return (
        <Typography sx={{ mt: 3, textAlign: 'center' }}>
          Không tìm thấy cơ sở vật chất nào phù hợp với "{searchQuery}".
        </Typography>
      );
    }

    return (
      <>
        <Box
          sx={{
            width: '100%',
            overflowX: 'auto',
            mt: 2,
            border: '1px solid rgba(224, 224, 224, 1)',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          }}
        >
          <TableContainer
            sx={{
              overflowX: 'auto',
              width: '100%',
              maxWidth: '1200px',
              border: '1px solid #e0e0e0',
              maxHeight: '60vh',
              boxShadow: 'none', // Thêm border cho TableContainer
            }}
            component={Paper}
          >
            <Table
              sx={{
                borderCollapse: 'collapse', // Đảm bảo các border không bị chồng chéo
                '& td, & th': {
                  border: '1px solid #e0e0e0', // Thêm border cho các ô trong bảng
                },
              }}
            >
              {/* --------- FIX START: TableHead --------- */}
              <TableHead>
                <TableRow
                  sx={{
                    '& th': { fontWeight: 'bold', backgroundColor: 'grey.100' },
                  }}
                >
                  <TableCell>Tên cơ sở vật chất</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right">Số lượng</TableCell>
                  <TableCell>Phòng ban (ID)</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProperties.map(property => (
                  <TableRow
                    key={property._id}
                    hover
                    onClick={() => handleRowClick(property._id)}
                    sx={{
                      cursor: 'pointer',
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {property.name}
                    </TableCell>
                    <TableCell>{property.status}</TableCell>
                    <TableCell align="right">{property.number}</TableCell>
                    <TableCell>{property.department}</TableCell>
                    <TableCell>
                      {convertToVietnamDate(property.createdAt)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        title="Chỉnh sửa cơ sở vật chất"
                        onClick={event => {
                          event.stopPropagation();
                          handleEditButton(property._id);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        title="Xóa cơ sở vật chất"
                        color="error"
                        onClick={event => {
                          event.stopPropagation();
                          handleDeleteButton(property._id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
          <TablePagination
            component="div"
            count={filteredProperties.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 15, 25]}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} / ${count !== -1 ? count : `hơn ${to}`}`
            }
          />
        </Box>
      </>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Typography
        variant="h5"
        gutterBottom
        component="div"
        sx={{ fontWeight: 'medium' }}
      >
        Quản Lý Cơ Sở Vật Chất
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
        <Grid item xs={12} sm={6} md={8}>
          <TextField
            fullWidth
            label="Tìm kiếm cơ sở vật chất (theo tên...)"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          sx={{ textAlign: { xs: 'left', sm: 'right' }, mt: { xs: 1, sm: 0 } }}
        >
          <Button
            onClick={handleCreateDialogOpen}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Thêm cơ sở vật chất mới
          </Button>
        </Grid>
      </Grid>

      {renderContent()}

      {/* <CreatePropertyDialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
      />
      <PropertyDetailDialog
        open={detailDialogOpen}
        onClose={handleDetailDialogClose}
        property={properties.find(p => p._id === selectedPropertyId) || null}
      />
       <EditPropertyDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        property={properties.find(p => p._id === selectedPropertyId) || null}
      /> */}

      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCloseConfirmDelete}
        aria-labelledby="delete-confirm-dialog-title"
        aria-describedby="delete-confirm-dialog-description"
      >
        <DialogTitle id="delete-confirm-dialog-title">
          Xác nhận xóa cơ sở vật chất
        </DialogTitle>
        <DialogContent>
          <Typography id="delete-confirm-dialog-description">
            Bạn có chắc chắn muốn xóa cơ sở vật chất{' '}
            <b>
              {properties.find(p => p._id === propertyToDeleteId)?.name || ''}
            </b>
            ?
            <br />
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmDelete}
            variant="outlined"
            color="secondary"
          >
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            autoFocus
          >
            Xác nhận Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
