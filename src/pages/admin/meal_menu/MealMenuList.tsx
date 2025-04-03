import { useState } from 'react';
import { Button } from '@mui/material';
import CreateMealMenuDialog from './CreateMenuDialog';

export default function MealMenuList() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        Mở Dialog
      </Button>
      <CreateMealMenuDialog open={dialogOpen} onClose={handleCloseDialog} />
    </>
  );
}
