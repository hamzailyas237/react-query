import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { addPost, fetchPosts, fetchTags } from "../utils/apis";

const Posts = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  // const {
  //   data: postData,
  //   isLoading,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: ["posts"],
  //   queryFn: fetchPosts,
  // });

  // With Pagination
  const {
    data: postData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts", { page }],
    queryFn: () => fetchPosts(page),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: tagsData,
    isLoading: tagsLoading,
    isError: isTagsError,
    error: tagsError,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    staleTime: Infinity, // data will save in cache foreever
    // gcTime: 0,
    // refetchInterval: 1000 * 5, // will fetched data in every 5 seconds
  });

  const {
    mutate,
    isLoading: createPostLoading,
    isError: isCreatePostError,
    error: createPostError,
    reset,
    // there are more functions check out in docs (for suggestion press ctrl + space)
  } = useMutation({
    mutationFn: addPost,
    // onMutate run before mutation
    onMutate: () => {
      return { text: "runs before mutation" };
    },
    // on success runs after the success of any response. When we are adding posts our page/component not updating real
    // time because of caching feature of react query.Go to devtools of react query inside mutation tabs you can see
    // see the mutation as well. Now go on queries tabs, select tabs then you can see see our data has gone stale, now
    // click on invalidate to get the data. we are doing the same thing using onSucces below to fetch data realtime.
    onSuccess: (data, variables, context) => {
      //data is retuned data in reponse,  varaibles are data we provided when calling mutate onSubmit, context comes
      // from onMutate()
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        // queryKey: ["posts",{page:1}], // If you have pages and you want to get the updated data or to invalidate the
        // data of certain page
        exact: true, // used to invalidate exact posts. If we donot give exact then it will invalidates all the data
        // containing key=posts
        // In predicate we can write any custome logic to invalidate our data
        // predicate: (query) => {
        //   query.queryKey[0] === "posts" && query.queryKey[1].page >=1
        // }
      });
    },
    onError: (error, varaibles, context) => {},
    // run every time either query succeeded or failed
    onSettled: (data, error, varaibles, context) => {},
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    // making array from all the keys of form data. Includes title and tag as well. We have make array first which
    // includes title and tag both but we want array of tags so we have add a filter as well.In filter we are retuning
    // the checkboxes which are on/selected
    const tags = Array.from(formData.keys()).filter(
      (tag) => formData.get(tag) === "on"
    );
    if (title && tags.length) {
      // use when not using pagination
      // mutate({ id: postData.length + 1, title: title, tags: tags });
      mutate({ id: postData.data.length + 1, title: title, tags: tags });
    }
    console.log("title", title);
    console.log("tags", tags);
  };
  return (
    <div className="container">
      {isLoading || (createPostLoading && <p>loading...</p>)}
      {isError && <p>{error.message}</p>}
      {isCreatePostError && (
        <p style={{ cursor: "pointer", color: "red" }} onClick={() => reset()}>
          Unable to post
        </p>
      )}
      <h1 className="title">Posts</h1>

      <div className="pages">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={!postData?.prev}
        >
          Previous Page
        </button>
        <span>{page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!postData?.next}
        >
          Next Page
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {/* {isPostError && <h5 onClick={() => reset()}>Unable to Post</h5>} */}
        <input
          type="text"
          placeholder="Enter your post.."
          className="postbox"
          name="title"
        />
        <div className="tags">
          {tagsData?.map((tag) => {
            return (
              <div key={tag}>
                <input name={tag} id={tag} type="checkbox" />
                <label htmlFor={tag}>{tag}</label>
              </div>
            );
          })}
        </div>
        {/* <button disabled={isPending}>
          {isPending ? "Posting..." : "Post"}
        </button> */}
        <button>Post</button>
      </form>

      {/* use it when not using paginatiion  */}
      {/* {postData?.map((post, i) => { */}
      {postData?.data?.map((post, i) => {
        return (
          <div className="post" key={post.id}>
            <div>{post.title}</div>
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default Posts;
