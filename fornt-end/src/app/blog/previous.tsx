'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, Grid } from '@mui/material';
import baseURL from '../apiConfig';
import ProfilePage from '../profile/page';

const BlogPosts = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [editMode, setEditMode] = useState(false);

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
        if (response.data.owner) {
          setBlogPosts(prevPosts => {
            return prevPosts.map(post => {
              if (post.id === selectedBlogPost.id) {
                return {
                  ...post,
                  comments: [...post.comments, response.data]
                };
              }
              return post;
            });
          });
          fetchBlogPosts();
        } else {
          console.error('User is not the owner of the comment.');
        }
      })
      .catch(error => {
        console.error('Error submitting comment:', error);
      });
  };
  
  const handleDeleteComment = (commentId) => {
    baseURL.delete(`/comments/${commentId}/`)
      .then(response => {
        console.log('Comment deleted:', response.data);
        setBlogPosts(prevPosts => {
          return prevPosts.map(post => {
            if (post.id === selectedBlogPost.id) {
              return {
                ...post,
                comments: post.comments.filter(comment => comment.id !== commentId)
              };
            }
            return post;
          });
        });
        fetchBlogPosts();
      })
      .catch(error => {
        console.error('Error deleting comment:', error);
      });
  };
  
 

  const updateBlogPost = (postId, newComment) => {
    setBlogPosts(prevPosts => {
      return prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment.id === newComment.id) {
                return newComment;
              }
              return comment;
            })
          };
        }
        return post;
      });
    });
  };

  const handleEditComment = () => {
    if (!selectedComment) return;

    const editedCommentData = {
      content: commentContent
    };

    baseURL.put(`/comments/${selectedComment.id}/`, editedCommentData)
      .then(response => {
        console.log('Comment edited:', response.data);
        setCommentContent('');
        setOpenDialog(false);
        updateBlogPost(selectedBlogPost.id, response.data);
        setEditMode(false);
      })
      .catch(error => {
        console.error('Error editing comment:', error);
      });
  };
  


  const handleEditButtonClick = (comment) => {
    setSelectedComment(comment);
    setCommentContent(comment.content);
    setEditMode(true);
    setOpenDialog(true);
  };

  return (
    <div>
      <ProfilePage />
      <Grid container spacing={2} style={{ margin: "20px" }}>
        {blogPosts.map(blogPost => (
          <Grid item key={blogPost.id} xs={12} sm={6} md={4}>
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
                        {comment.owner && (
                          <div>
                            <Button onClick={() => handleEditButtonClick(comment)}>
                              Edit
                            </Button>
                            <Button onClick={() => handleDeleteComment(comment.id)}>
                              Delete
                            </Button>
                          </div>
                        )}
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
        <DialogTitle>{editMode ? "Edit Comment" : "Add Comment"}</DialogTitle>
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
          {editMode ? (
            <Button onClick={handleEditComment} color="primary">
              Save
            </Button>
          ) : (
            <Button onClick={handleCommentSubmit} color="primary">
              Submit
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogPosts;
