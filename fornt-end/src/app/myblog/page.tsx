
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
  const [selectedPost, setSelectedPost] = useState(null);

const fetchBlogPosts = () => {
  baseURL.get('/blogposts/')
    .then(response => {
      console.log('Fetched blog posts:', response.data);
      const filteredPosts = response.data.results.filter(post => post.owner);
      setBlogPosts(filteredPosts);
    })
    .catch(error => {
      console.error('Error fetching blog posts:', error);
    });
};

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleCreate = () => {
    setSelectedPost(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPost(null);
    setNewPost({ title: '', content: '' }); 
  };
  
  const handleSave = () => {
    if (selectedPost) {
      console.log('Updated post:', newPost);
      baseURL.put(`/blogposts/${selectedPost.id}/`, newPost)
        .then(response => {
          console.log('Blog post updated:', response.data);
          const updatedPosts = blogPosts.map(post =>
            post.id === response.data.id ? response.data : post
          );
          setBlogPosts(updatedPosts);
          setOpenDialog(false);
          setSelectedPost(null); 
          setNewPost({ title: '', content: '' }); 
        })
        .catch(error => {
          console.error('Error updating blog post:', error);
        });
    } else {
      baseURL.post('/blogposts/', newPost)
        .then(response => {
          console.log('New blog post created:', response.data);
          setBlogPosts([...blogPosts, response.data]);
          setOpenDialog(false);
          setSelectedPost(null); 
          setNewPost({ title: '', content: '' }); 
        })
        .catch(error => {
          console.error('Error creating blog post:', error);
        });
    }
  };

  const handleUpdate = (id) => {
    const postToUpdate = blogPosts.find(post => post.id === id);
    setSelectedPost(postToUpdate);
    setNewPost({ title: postToUpdate.title, content: postToUpdate.content });
    setOpenDialog(true); 
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
        <DialogTitle>{selectedPost ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
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
          <Button onClick={handleSave} color="primary">{selectedPost ? 'Update' : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MyBlog;
