'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, Grid } from '@mui/material'; // Import Grid from Material-UI
import baseURL from '../apiConfig';
import ProfilePage from '../profile/page';

const BlogPosts = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = () => {
    baseURL.get('/blogposts/')
      .then(response => {
        setBlogPosts(response.data.results);
      })
      .catch(error => {
        console.error('Error fetching blog posts:', error);
      });
  };

  const handleCommentSubmit = () => {
    if (!selectedBlogPost) return;

    const commentData = {
      content: commentContent,
      blog_post: selectedBlogPost.id
    };

    baseURL.post('/comments/', commentData)
      .then(response => {
        console.log('Comment submitted:', response.data);
        setCommentContent('');
        setOpenDialog(false);
        updateBlogPost(selectedBlogPost.id, response.data); 
      })
      .catch(error => {
        console.error('Error submitting comment:', error);
      });
  };

  const updateBlogPost = (postId, newComment) => {
    setBlogPosts(prevPosts => {
      return prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      });
    });
  };

  return (
    <div>
      <ProfilePage/>
      <Grid container spacing={2}> {/* Create a grid container with spacing */}
        {blogPosts.map(blogPost => (
          <Grid item key={blogPost.id} xs={12} sm={6} md={4}> {/* Define the grid item with different sizes for different screen widths */}
            <Card style={{ marginBottom: '20px' }}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {blogPost.title}
                </Typography>
                <Typography color="textSecondary">
                  {blogPost.content}
                </Typography>
                <Typography variant="body2" component="p">
                  Comments:
                  {blogPost.comments.map(comment => (
                    <div key={comment.creation_date}>
                      <Typography variant="body2" color="textSecondary">
                        {comment.content} - {comment.author_username}
                      </Typography>
                    </div>
                  ))}
                </Typography>
                <Button variant="outlined" onClick={() => {
                  setSelectedBlogPost(blogPost);
                  setOpenDialog(true);
                }}>
                  Comment
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your Comment"
            type="text"
            fullWidth
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <Button onClick={handleCommentSubmit} color="primary">
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogPosts;
