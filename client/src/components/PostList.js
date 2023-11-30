import PostItem from "./PostItem";

const PostList = ({data, title}) => {
    return (
        <section style={{border: '1px solid black', padding: '1rem', margin: '0.5rem 0', backgroundColor: 'lightyellow'}}>
            <h1 style={{textAlign: 'center', backgroundColor: 'lightblue'}}>{title}</h1>
            {!data.length && (
                <h1 style={{textAlign: 'center', marginTop: '1rem'}}>No Posts...</h1>
            )}
            {data.map(item => {
                return <PostItem key={item._id} data={item}/>
            })}
        </section>
    );
}

export default PostList;