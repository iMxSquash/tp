import { useState, useEffect } from "react";
import { data, Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import * as ACTIONS from "../redux/reducers/article.reducer";

const Home = () => {
    const [article, setArticle] = useState([]);
    const [error, setError] = useState(null);

    const dispatch = useDispatch()

    useEffect(() => {
        const fetchArticle = async () => {
            dispatch(ACTIONS.FETCH_ARTICLE_START())

            try {
                const response = await fetch("http://localhost:8000/api/article/all");
                dispatch(ACTIONS.FETCH_ARTICLE_SUCCESS(data))
            } catch (e) {
                console.log(e.message)
            }
        };
        fetchArticle();
    }, []);

    if (error) return <><p>{error}</p></>

    return (
        <>
            <h1>Bienvenue sur ma page d'accueil</h1>
            {article.map((item) => (
                <div key={item._id}>
                    <h2>{item.name}</h2>
                    <Link to={{ pathname: `/detail/${item._id}` }}>
                        <img src={item.picture.img} alt={item.name} width={200} />
                    </Link>
                    <p>{item.price}</p>
                    <Link to={{ pathname: `/update/${item._id}` }}>Update</Link>
                </div>
            ))}
        </>
    );
};

export default Home;