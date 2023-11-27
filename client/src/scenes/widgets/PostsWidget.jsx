import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../states";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    try {
      const response = await fetch("/posts/", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.log(error);
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await fetch(`posts/${userId}/posts`, {
        method: "GET",
        Authorization: `Bearer ${token}`,
      });

      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []);
  return (
    <>
      {console.log(posts)}
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            userId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
