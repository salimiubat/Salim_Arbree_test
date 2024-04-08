from django.db import models


from django.contrib.auth.models import AbstractUser


class User(AbstractUser):

    
    def save(self, *args, **kwargs):        
        self.is_staff = True
        self.is_superuser = True
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    class Meta:
        ordering = ['-creation_date']

class Comment(models.Model):
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author.username} on {self.blog_post.title}"