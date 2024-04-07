
'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import baseURL from '../apiConfig';
import ProfilePage from '../profile/page';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

function MyBlog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  useEffect(() => {
    baseURL.get('/blogposts/')
      .then(response => {
        console.log('Fetched blog posts:', response.data);
        setBlogPosts(response.data.results);     })
      .catch(error => {
        console.error('Error fetching blog posts:', error);
      });
  }, []);

  const handleCreate = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = () => {
    console.log('New post:', newPost);
    baseURL.post('/blogposts/', newPost)
      .then(response => {
        console.log('New blog post created:', response.data);
        setBlogPosts([...blogPosts, response.data]);
        setNewPost({ title: '', content: '' });
        setOpenDialog(false);
      })
      .catch(error => {
        console.error('Error creating blog post:', error);
      });
  };

  const handleUpdate = (id) => {
    console.log('Handle update operation for blog post with ID:', id);
  };

  const handleDelete = (id) => {
    baseURL.delete(`/blogposts/${id}`)
        .then(response => {
            setBlogPosts(blogPosts.filter(post => post.id !== id));
        })
        .catch(error => {
            console.error('Error deleting blog post:', error);
        });
};



  return (
    <div style={{ height: "auto", margin:"auto",padding:"10 px" }} className='container-fluid'>
      <ProfilePage/>
      <div style={ {height: 400, width: '70%', margin:"auto"} }>
      <Button variant="contained" onClick={handleCreate} style={{margin:"10px"}}>Create</Button>

<DataGrid
  rows={blogPosts}
  columns={[
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'content', headerName: 'Content', width: 300 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 400,
      renderCell: (params) => (
        <>
          {params.row.owner && ( 
            <>
              <Button variant="contained" color="secondary" onClick={() => handleUpdate(params.row.id)} style={{marginRight:"2px"}}>Update</Button>

              <Button variant="contained" color="error" onClick={() => handleDelete(params.row.id)}>Delete</Button>

            </>
          )}
        </>
      ),
    },
  ]}
  pageSize={5}
  rowsPerPageOptions={[5, 10, 20]}
/>
      </div>
     

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create New Blog Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MyBlog;