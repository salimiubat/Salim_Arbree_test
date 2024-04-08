
from rest_framework import viewsets, status
from .models import *
from .serializer import *
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]

    

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.author != request.user:
            return Response({"message": "You do not have permission to perform this action."},
                             status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.author != request.user:
            return Response({"message": "You do not have permission to perform this action."},
                             status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # serializer.save(author=self.request.user)
        # def perform_create(self, serializer):
        serializer.save(author=self.request.user, blog_post_id=self.request.data.get('blog_post'))


    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.author != request.user:
            return Response({"message": "You do not have permission to perform this action."},
                             status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.author != request.user:
            return Response({"message": "You do not have permission to perform this action."}, 
                            status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)