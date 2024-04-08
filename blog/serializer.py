from rest_framework import serializers
from .models import BlogPost, Comment,User

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        return data
    
class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},  
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data.get('password'))
        return super().update(instance, validated_data)

class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    owner = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["id",'content', 'author_username', 'creation_date', 'owner']
        # read_only_fields = ['owner','blog_post']
        read_only_fields = ['owner']
        extra_kwargs = {
            'blog_post': {'required': True}  
        }

    def get_owner(self, obj):
        request = self.context.get('request', None)
        if request and request.user == obj.author:
            return True
        return False
    


class BlogPostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True, source='comment_set')
    owner = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = '__all__'
        read_only_fields = ['owner','author']
    
    def get_owner(self, obj):
        request = self.context.get('request', None)
        if request and request.user == obj.author:
            return True
        return False