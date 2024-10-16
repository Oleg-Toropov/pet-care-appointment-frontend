import { useState } from "react";
import bg1 from "../../assets/images/bg1.jpg";
import bg2 from "../../assets/images/bg2.jpg";
import bg3 from "../../assets/images/bg3.jpg";
import bg4 from "../../assets/images/bg4.jpg";
import { Carousel } from "react-bootstrap";

const BackgroundImageSlider = () => {
  const backgrounds = [bg1, bg2, bg3, bg4];
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="background-slider">
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        interval={15000}
        controls={false}
        indicators={false}
      >
        {backgrounds.map((background, idx) => (
          <Carousel.Item key={idx}>
            <img
              className="d-block w-100"
              src={background}
              alt={`Slide ${idx}`}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default BackgroundImageSlider;
