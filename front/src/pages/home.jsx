import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as ACTIONS from "../redux/reducers/article.reducer";
import axios from 'axios';

const Home = () => {
    const [article, setArticle] = useState([]);
    const [error, setError] = useState(null);

    const dispatch = useDispatch()

    const api = axios.create({
        baseURL: 'http://localhost:8000/api',
    });

    useEffect(() => {
        const fetchArticle = async () => {
            dispatch(ACTIONS.FETCH_ARTICLE_START());
            try {
                const { data } = await api.get("/article/all");
                console.log(data);
                dispatch(ACTIONS.FETCH_ARTICLE_SUCCESS(data));
            } catch (error) {
                console.log(error.response?.data?.message);
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