-npm i json-server
-save json sample data
-in terminal run, npx json-server datapath(like src/utils/data.json)

If you have multiple data like below then json-server consider its to mutiple server so it will give error, therefore remove one data and run command again then add removed data again.
// Data 1 is posts and 2 is tags
{
"posts": [
{
"id": 1,
"title": "His mother had always taught him",
"tags": ["history", "crime"]
}
],
"tags": [
"classic",
"crime",
"english",
"fiction",
"french"
]
}

const fetchPosts = async (page) => {
const response = await fetch(
`http://localhost:3000/posts?_sort=-id&${
      page ? `\_page=${page}&\_per_page=5` : ""
    }`
);
const { data, isLoading, isError } = useQuery({
queryKey: ["posts"], // key is used to uniquely identify each request
queryFn: fetchPosts, // api function
});

queryKey is an array because we can pass arguments from here as well lile that queryKey: ["posts",{page:1}],
Now il will create a unique query for that particular page and it helps react query for caching the data uniquely for that particular page

react query also provides it devtools, install it and configure it by following docs
npm i @tanstack/react-query-devtools

when ever we use mutate in use query our data is always go in state then to refetch it we have to invalidate the data

We can use useQueries for mutiple queries at a time
