import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = ({ images, baseUrl = '', preview = false }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
    };

    if (!images || images.length === 0) {
        return null;
    }

    if (preview) {
        if (images.length === 1) {
            return (
                <div className="slider-container">
                    <div className="slide-item">
                        <img 
                            src={URL.createObjectURL(images[0])} 
                            alt="Vue principale"
                        />
                    </div>
                </div>
            );
        }

        return (
            <div className="slider-container">
                <Slider {...settings}>
                    {images.map((file, index) => (
                        <div key={index} className="slide-item">
                            <img 
                                src={URL.createObjectURL(file)} 
                                alt={`Slide ${index + 1}`}
                            />
                        </div>
                    ))}
                </Slider>
            </div>
        );
    }

    if (images.length === 1) {
        return (
            <div className="slider-container">
                <div className="slide-item">
                    <img 
                        src={`${baseUrl}${images[0]}`}
                        alt="Vue principale"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="slider-container">
            <Slider {...settings}>
                {images.map((imgPath, index) => (
                    <div key={index} className="slide-item">
                        <img 
                            src={`${baseUrl}${imgPath}`} 
                            alt={`Slide ${index + 1}`}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageSlider;
