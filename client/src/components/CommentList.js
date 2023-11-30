import CommentItem from "./CommentItem";

const CommentList = ({data}) => {
    return (
        <section style={{border: '1px solid black', padding: '1rem', margin: '1rem 0'}}>
            <h1 style={{backgroundColor: 'lightblue', textAlign: 'center'}}>Comments</h1>
            {data.map(item => {
                return <CommentItem key={item._id} data={item}/>
            })}
        </section>
    );
}

export default CommentList;