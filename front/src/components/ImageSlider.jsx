import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = ({ images, baseUrl = '' }) => {
    const imageArray = Array.isArray(images) ? images : [images].filter(Boolean);

    if (!imageArray || imageArray.length === 0) {
        return null;
    }

    if (imageArray.length === 1) {
        return (
            <div className="slider-container">
                <div className="slide-item">
                    <img 
                        src={typeof imageArray[0] === 'string' ? `${baseUrl}${imageArray[0]}` : URL.createObjectURL(imageArray[0])} 
                        alt="Vue principale"
                    />
                </div>
            </div>
        );
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
    };

    return (
        <div className="slider-container">
            <Slider {...settings}>
                {imageArray.map((img, index) => (
                    <div key={index} className="slide-item">
                        <img 
                            src={typeof img === 'string' ? `${baseUrl}${img}` : URL.createObjectURL(img)} 
                            alt={`Slide ${index + 1}`}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageSlider;
