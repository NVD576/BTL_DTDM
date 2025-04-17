import React, { useEffect, useRef, useState } from "react";
import { auth, googleProvider, fbProvider } from "../../firebase/config";
import styled from "styled-components";
import { gsap } from "gsap";
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthProvider';
import { set } from "lodash";


const Container = styled.div`
  background-color: #eff3f4;
  position: relative;
  width: 100%;
  height: 100vh;
  font-size: 16px;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
`;

const Form = styled.form`
  position: absolute;
  top: 10%;
  left: 35%;
  display: block;
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  margin: 0;
  padding: 2.25em;
  box-sizing: border-box;
  border: solid 1px #ddd;
  border-radius: 0.5em;
`;

const SvgContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 1em;
  border-radius: 50%;
  pointer-events: none;

  div {
    position: relative;
    width: 100%;
    height: 0;
    overflow: hidden;
    border-radius: 50%;
    padding-bottom: 100%;
  }

  .mySVG {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: inherit;
    height: inherit;
    box-sizing: border-box;
    border: solid 2.5px #217093;
    border-radius: 50%;
  }
`;

const InputGroup = styled.div`
  margin: 0 0 2em;
  padding: 0;
  position: relative;

  &:last-of-type {
    margin-bottom: 0;
  }

  label {
    margin: 0 0 12px;
    display: block;
    font-size: 1.25em;
    color: #217093;
    font-weight: 700;
    font-family: inherit;
  }

  input[type="email"],
  input[type="text"],
  input[type="password"] {
    display: block;
    margin: 0;
    padding: 10px;
    background-color: #f3fafd;
    border: solid 2px #217093;
    border-radius: 4px;
    box-sizing: border-box;
    width: 100%;
    height: 65px;
    font-size: 1.55em;
    color: #353538;
    font-weight: 600;
    font-family: inherit;
    transition: box-shadow 0.2s linear, border-color 0.25s ease-out;

    &:focus {
      outline: none;
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
      border: solid 2px #4eb8dd;
    }
  }

  button {
    display: block;
    margin: 0;
    padding: 10px;
    background-color: #4eb8dd;
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    width: 100%;
    height: 65px;
    font-size: 1.55em;
    color: #fff;
    font-weight: 600;
    font-family: inherit;
    transition: background-color 0.2s ease-out;

    &:hover,
    &:active {
      background-color: #217093;
    }
  }
`;

const PasswordToggle = styled.label`
  display: block;
  padding: 0 0 0 1.45em;
  position: absolute;
  top: 0.25em;
  right: 0;
  font-size: 1em;

  input {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }

  .indicator {
    position: absolute;
    top: 0;
    left: 0;
    height: 0.85em;
    width: 0.85em;
    background-color: #f3fafd;
    border: solid 2px #217093;
    border-radius: 3px;

    &:after {
      content: "";
      position: absolute;
      left: 0.25em;
      top: 0.025em;
      width: 0.2em;
      height: 0.5em;
      border: solid #217093;
      border-width: 0 3px 3px 0;
      transform: rotate(45deg);
      visibility: ${(props) => (props.checked ? "visible" : "hidden")};
    }
  }
`;
const ForgotPasswordLink = styled.button`
  background: none !important; /* Ghi đè background từ InputGroup */
  border: none !important; /* Ghi đè border */
  color: rgb(148, 179, 192) !important;
  text-decoration: underline;
  cursor: pointer;
  font-size: 1em !important;
  font-family: "Source Sans Pro", sans-serif;
  position: absolute; /* Đặt vị trí tuyệt đối trong InputGroup */
  bottom: -20px; /* Đẩy xuống dưới input */
  right: 0; /* Căn sang phải */
  padding: 0 !important; /* Ghi đè padding */
  width: auto !important; /* Không kế thừa width 100% */
  height: auto !important; /* Không kế thừa height 65px */
  transition: color 0.2s ease-out;

  &:hover {
    color: #4eb8dd !important; /* Đổi màu khi hover */
  }
`;
const SocialButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px; /* Khoảng cách giữa 2 nút */
  margin-top: 10px; /* Cách nút Log in */
`;

const SocialButton = styled.button`
  background: none;
  border: none;
  padding: 10px;
  cursor: pointer;
  transition: transform 0.2s ease-out;

  &:hover {
    transform: scale(1.2); /* Phóng to icon khi hover */
  }

  img {
    width: 30px; /* Kích thước icon */
    vertical-align: middle;
  }
`;
export default function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const svgRef = useRef(null);
  const twoFingersRef = useRef(null);
  const armLRef = useRef(null);
  const armRRef = useRef(null);
  const eyeLRef = useRef(null);
  const eyeRRef = useRef(null);
  const noseRef = useRef(null);
  const mouthRef = useRef(null);
  const toothRef = useRef(null);
  const tongueRef = useRef(null);
  const chinRef = useRef(null);
  const faceRef = useRef(null);
  const eyebrowRef = useRef(null);
  const outerEarLRef = useRef(null);
  const outerEarRRef = useRef(null);
  const earHairLRef = useRef(null);
  const earHairRRef = useRef(null);
  const hairRef = useRef(null);



  const { setUser, setRe , setIsLoginGoogle} = React.useContext(AuthContext);

  let eyeScale = 1;
  let eyesCovered = false;


  
  const handleLoginGG = async (provider) => {
    try {
      
      await auth.signInWithPopup(provider);

      setRe(true);
      setIsLoginGoogle(true);
    } catch (error) {
      setRe(false);
      console.error('Lỗi đăng nhập:', error);
      alert('Đăng nhập thất bại: ' + error.message);
    }
  };

    const handleLogin = async (e) => {
      e.preventDefault();

      if (!email || !password) {
        alert("Email and password are required.");
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        alert("Invalid email format.");
        return;
      }

      try {
        const userInfo = {
          email,
          password,
        };
        console.log("Logging in with:", userInfo);
        setUser(userInfo);
        setRe(true);
      } catch (error) {
          setRe(false);
          console.error("Login error:", error.code, error.message);
          alert(error.message);
      }
  };
  useEffect(() => {
    const initLoginForm = () => {
      if (
        !armLRef.current ||
        !armRRef.current ||
        !mouthRef.current ||
        !eyeLRef.current ||
        !eyeRRef.current
      ) {
        console.warn("⚠️ Một hoặc nhiều phần tử chưa sẵn sàng.");
        return;
      }

      gsap.set(armLRef.current, {
        x: -93,
        y: 220,
        rotation: 105,
        transformOrigin: "top left",
      });

      gsap.set(armRRef.current, {
        x: -93,
        y: 220,
        rotation: -105,
        transformOrigin: "top right",
      });

      gsap.set(mouthRef.current, { transformOrigin: "center center" });

      const startBlinking = (delay) => {
        if (!eyeLRef.current || !eyeRRef.current) return;

        gsap.to([eyeLRef.current, eyeRRef.current], {
          delay: delay || 1,
          duration: 0.1,
          scaleY: 0,
          yoyo: true,
          repeat: 1,
          transformOrigin: "center center",
          onComplete: () => startBlinking(Math.floor(Math.random() * 12)),
        });
      };

      startBlinking(5);
    };

    initLoginForm();
  }, []);

  const calculateFaceMove = () => {
    const svgCoords = svgRef.current.getBoundingClientRect();
    const emailCoords = emailRef.current.getBoundingClientRect();
    const screenCenter = svgCoords.x + svgRef.current.offsetWidth / 2;
    const eyeLCoords = { x: svgCoords.x + 84, y: svgCoords.y + 76 };
    const eyeRCoords = { x: svgCoords.x + 113, y: svgCoords.y + 76 };
    const noseCoords = { x: svgCoords.x + 97, y: svgCoords.y + 81 };
    const mouthCoords = { x: svgCoords.x + 100, y: svgCoords.y + 100 };

    const carPos = emailRef.current.selectionEnd || email.length;
    const div = document.createElement("div");
    const span = document.createElement("span");

    // Apply only the necessary styles for caret position calculation
    div.style.position = "absolute";
    div.style.visibility = "hidden"; // Hide the div from view
    div.style.fontSize = "1.55em"; // Match input font-size
    div.style.fontFamily = "'Source Sans Pro', sans-serif"; // Match input font-family
    div.style.fontWeight = "600"; // Match input font-weight
    div.style.padding = "10px"; // Match input padding
    div.style.border = "solid 2px #217093"; // Match input border
    div.style.boxSizing = "border-box"; // Match input box-sizing
    div.style.width = `${emailCoords.width}px`; // Match input width

    document.body.appendChild(div);
    div.textContent = email.substr(0, carPos);
    span.textContent = email.substr(carPos) || ".";
    div.appendChild(span);

    const caretCoords = span.getBoundingClientRect();
    const dFromC = screenCenter - (caretCoords.x + emailCoords.x);

    const eyeLAngle = Math.atan2(
      eyeLCoords.y - (emailCoords.y + 25),
      eyeLCoords.x - (emailCoords.x + caretCoords.x)
    );
    const eyeRAngle = Math.atan2(
      eyeRCoords.y - (emailCoords.y + 25),
      eyeRCoords.x - (emailCoords.x + caretCoords.x)
    );
    const noseAngle = Math.atan2(
      noseCoords.y - (emailCoords.y + 25),
      noseCoords.x - (emailCoords.x + caretCoords.x)
    );
    const mouthAngle = Math.atan2(
      mouthCoords.y - (emailCoords.y + 25),
      mouthCoords.x - (emailCoords.x + caretCoords.x)
    );

    const eyeLX = Math.cos(eyeLAngle) * 20;
    const eyeLY = Math.sin(eyeLAngle) * 10;
    const eyeRX = Math.cos(eyeRAngle) * 20;
    const eyeRY = Math.sin(eyeRAngle) * 10;
    const noseX = Math.cos(noseAngle) * 23;
    const noseY = Math.sin(noseAngle) * 10;
    const mouthX = Math.cos(mouthAngle) * 23;
    const mouthY = Math.sin(mouthAngle) * 10;
    const mouthR = Math.cos(mouthAngle) * 6;
    const chinX = mouthX * 0.8;
    const chinY = mouthY * 0.5;
    let chinS = 1 - (dFromC * 0.15) / 100;
    if (chinS > 1) chinS = 1 - (chinS - 1);
    if (chinS < 0.5) chinS = 0.5;

    gsap.to(eyeLRef.current, {
      x: -eyeLX,
      y: -eyeLY,
      duration: 1,
      ease: "expo.out",
    });
    gsap.to(eyeRRef.current, {
      x: -eyeRX,
      y: -eyeRY,
      duration: 1,
      ease: "expo.out",
    });
    gsap.to(noseRef.current, {
      x: -noseX,
      y: -noseY,
      rotation: mouthR,
      transformOrigin: "center center",
      duration: 1,
      ease: "expo.out",
    });
    gsap.to(mouthRef.current, {
      x: -mouthX,
      y: -mouthY,
      rotation: mouthR,
      transformOrigin: "center center",
      duration: 1,
      ease: "expo.out",
    });
    gsap.to(chinRef.current, {
      x: -chinX,
      y: -chinY,
      scaleY: chinS,
      duration: 1,
      ease: "expo.out",
    });

    document.body.removeChild(div);
  };
  const resetFace = () => {
    gsap.to([eyeLRef.current, eyeRRef.current], {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      duration: 1,
      ease: "expo.out",
    });
    gsap.to(noseRef.current, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 1,
      ease: "expo.out",
    });
    gsap.to(mouthRef.current, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 1,
      ease: "expo.out",
    });
    gsap.to(chinRef.current, {
      x: 0,
      y: 0,
      scaleY: 1,
      duration: 1,
      ease: "expo.out",
    });
    gsap.to(toothRef.current, { x: 0, y: 0, duration: 1, ease: "expo.out" });
    gsap.to(tongueRef.current, { y: 0, duration: 1, ease: "expo.out" });
  };
  const onEmailInput = () => {
    calculateFaceMove();
    if (email.length > 0) {
      if (email.includes("@")) {
        gsap.to(toothRef.current, {
          x: 3,
          y: -2,
          duration: 1,
          ease: "expo.out",
        });
        gsap.to(tongueRef.current, { y: 2, duration: 1, ease: "expo.out" });
        gsap.to([eyeLRef.current, eyeRRef.current], {
          scaleX: 0.65,
          scaleY: 0.65,
          duration: 1,
          ease: "expo.out",
          transformOrigin: "center center",
        });
        eyeScale = 0.65;
      } else {
        gsap.to(toothRef.current, {
          x: 0,
          y: 0,
          duration: 1,
          ease: "expo.out",
        });
        gsap.to(tongueRef.current, {
          x: 0,
          y: 1,
          duration: 1,
          ease: "expo.out",
        });
        gsap.to([eyeLRef.current, eyeRRef.current], {
          scaleX: 0.85,
          scaleY: 0.85,
          duration: 1,
          ease: "expo.out",
        });
        eyeScale = 0.85;
      }
    } else {
      gsap.to(toothRef.current, { x: 0, y: 0, duration: 1, ease: "expo.out" });
      gsap.to(tongueRef.current, { y: 0, duration: 1, ease: "expo.out" });
      gsap.to([eyeLRef.current, eyeRRef.current], {
        scaleX: 1,
        scaleY: 1,
        duration: 1,
        ease: "expo.out",
      });
      eyeScale = 1;
    }
  };

  const coverEyes = () => {
    gsap.killTweensOf([armLRef.current, armRRef.current]);
    gsap.set([armLRef.current, armRRef.current], { visibility: "visible" });
    gsap.to(armLRef.current, {
      x: -93,
      y: 10,
      rotation: 0,
      duration: 0.45,
      ease: "quad.out",
    });
    gsap.to(armRRef.current, {
      x: -93,
      y: 10,
      rotation: 0,
      duration: 0.45,
      ease: "quad.out",
      delay: 0.1,
    });
    eyesCovered = true;
  };

  const uncoverEyes = () => {
    gsap.killTweensOf([armLRef.current, armRRef.current]);
    gsap.to(armLRef.current, { y: 220, duration: 1.35, ease: "quad.out" });
    gsap.to(armLRef.current, {
      rotation: 105,
      duration: 1.35,
      ease: "quad.out",
      delay: 0.1,
    });
    gsap.to(armRRef.current, { y: 220, duration: 1.35, ease: "quad.out" });
    gsap.to(armRRef.current, {
      rotation: -105,
      duration: 1.35,
      ease: "quad.out",
      delay: 0.1,
      onComplete: () =>{
        if(armLRef.current && armRRef.current){
          gsap.set([armLRef.current, armRRef.current], { visibility: "hidden" });
        }
      }
        
    });
    eyesCovered = false;
  };

  const spreadFingers = () => {
    gsap.to(twoFingersRef.current, {
      transformOrigin: "bottom left",
      rotation: 30,
      x: -9,
      y: -2,
      duration: 0.35,
      ease: "power2.inOut",
    });
  };

  const closeFingers = () => {
    gsap.to(twoFingersRef.current, {
      transformOrigin: "bottom left",
      rotation: 0,
      x: 0,
      y: 0,
      duration: 0.35,
      ease: "power2.inOut",
    });
  };


  return (
    <Container>
      <Form onSubmit={handleLogin}>
        <SvgContainer>
          <div>
            <svg
              ref={svgRef}
              className="mySVG"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 200"
            >
              <defs>
                <circle id="armMaskPath" cx="100" cy="100" r="100" />
              </defs>
              <clipPath id="armMask">
                <use xlinkHref="#armMaskPath" overflow="visible" />
              </clipPath>
              <circle cx="100" cy="100" r="100" fill="#a9ddf3" />
              <g className="body">
                <path
                  className="bodyBGnormal"
                  stroke="#3A5E77"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="#FFFFFF"
                  d="M200,158.5c0-20.2-14.8-36.5-35-36.5h-14.9V72.8c0-27.4-21.7-50.4-49.1-50.8c-28-0.5-50.9,22.1-50.9,50v50 H35.8C16,122,0,138,0,157.8L0,213h200L200,158.5z"
                />
                <path
                  fill="#DDF1FA"
                  d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9 C143,167.5,122.9,156.4,100,156.4z"
                />
              </g>
              <g className="earL">
                <g
                  className="outerEar"
                  ref={outerEarLRef}
                  fill="#ddf1fa"
                  stroke="#3a5e77"
                  strokeWidth="2.5"
                >
                  <circle cx="47" cy="83" r="11.5" />
                  <path
                    d="M46.3 78.9c-2.3 0-4.1 1.9-4.1 4.1 0 2.3 1.9 4.1 4.1 4.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <g className="earHair" ref={earHairLRef}>
                  <rect x="51" y="64" fill="#FFFFFF" width="15" height="35" />
                  <path
                    d="M53.4 62.8C48.5 67.4 45 72.2 42.8 77c3.4-.1 6.8-.1 10.1.1-4 3.7-6.8 7.6-8.2 11.6 2.1 0 4.2 0 6.3.2-2.6 4.1-3.8 8.3-3.7 12.5 1.2-.7 3.4-1.4 5.2-1.9"
                    fill="#fff"
                    stroke="#3a5e77"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
              <g className="earR">
                <g className="outerEar" ref={outerEarRRef}>
                  <circle
                    fill="#DDF1FA"
                    stroke="#3A5E77"
                    strokeWidth="2.5"
                    cx="153"
                    cy="83"
                    r="11.5"
                  />
                  <path
                    fill="#DDF1FA"
                    stroke="#3A5E77"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M153.7,78.9 c2.3,0,4.1,1.9,4.1,4.1c0,2.3-1.9,4.1-4.1,4.1"
                  />
                </g>
                <g className="earHair" ref={earHairRRef}>
                  <rect x="134" y="64" fill="#FFFFFF" width="15" height="35" />
                  <path
                    fill="#FFFFFF"
                    stroke="#3A5E77"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M146.6,62.8 c4.9,4.6,8.4,9.4,10.6,14.2c-3.4-0.1-6.8-0.1-10.1,0.1c4,3.7,6.8,7.6,8.2,11.6c-2.1,0-4.2,0-6.3,0.2c2.6,4.1,3.8,8.3,3.7,12.5 c-1.2-0.7-3.4-1.4-5.2-1.9"
                  />
                </g>
              </g>
              <path
                ref={chinRef}
                className="chin"
                d="M84.1 121.6c2.7 2.9 6.1 5.4 9.8 7.5l.9-4.5c2.9 2.5 6.3 4.8 10.2 6.5 0-1.9-.1-3.9-.2-5.8 3 1.2 6.2 2 9.7 2.5-.3-2.1-.7-4.1-1.2-6.1"
                fill="none"
                stroke="#3a5e77"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                ref={faceRef}
                className="face"
                fill="#DDF1FA"
                d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46"
              />
              <path
                ref={hairRef}
                className="hair"
                fill="#FFFFFF"
                stroke="#3A5E77"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M81.457,27.929 c1.755-4.084,5.51-8.262,11.253-11.77c0.979,2.565,1.883,5.14,2.712,7.723c3.162-4.265,8.626-8.27,16.272-11.235 c-0.737,3.293-1.588,6.573-2.554,9.837c4.857-2.116,11.049-3.64,18.428-4.156c-2.403,3.23-5.021,6.391-7.852,9.474"
              />
              <g ref={eyebrowRef} className="eyebrow">
                <path
                  fill="#FFFFFF"
                  d="M138.142,55.064c-4.93,1.259-9.874,2.118-14.787,2.599c-0.336,3.341-0.776,6.689-1.322,10.037 c-4.569-1.465-8.909-3.222-12.996-5.226c-0.98,3.075-2.07,6.137-3.267,9.179c-5.514-3.067-10.559-6.545-15.097-10.329 c-1.806,2.889-3.745,5.73-5.816,8.515c-7.916-4.124-15.053-9.114-21.296-14.738l1.107-11.768h73.475V55.064z"
                />
                <path
                  fill="#FFFFFF"
                  stroke="#3A5E77"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M63.56,55.102 c6.243,5.624,13.38,10.614,21.296,14.738c2.071-2.785,4.01-5.626,5.816-8.515c4.537,3.785,9.583,7.263,15.097,10.329 c1.197-3.043,2.287-6.104,3.267-9.179c4.087,2.004,8.427,3.761,12.996,5.226c0.545-3.348,0.986-6.696,1.322-10.037 c4.913-0.481,9.857-1.34,14.787-2.599"
                />
              </g>
              <g ref={eyeLRef} className="eyeL">
                <circle cx="85.5" cy="78.5" r="3.5" fill="#3a5e77" />
                <circle cx="84" cy="76" r="1" fill="#fff" />
              </g>
              <g ref={eyeRRef} className="eyeR">
                <circle cx="114.5" cy="78.5" r="3.5" fill="#3a5e77" />
                <circle cx="113" cy="76" r="1" fill="#fff" />
              </g>
              <g ref={mouthRef} className="mouth">
                <path
                  fill="#617E92"
                  d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"
                />
                <clipPath id="mouthMask">
                  <path d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
                </clipPath>
                <g clipPath="url(#mouthMask)">
                  <g ref={tongueRef} className="tongue">
                    <circle cx="100" cy="107" r="8" fill="#cc4a6c" />
                    <ellipse
                      className="tongueHighlight"
                      cx="100"
                      cy="100.5"
                      rx="3"
                      ry="1.5"
                      opacity=".1"
                      fill="#fff"
                    />
                  </g>
                </g>
                <path
                  ref={toothRef}
                  clipPath="url(#mouthMask)"
                  className="tooth"
                  style={{ fill: "#FFFFFF" }}
                  d="M106,97h-4c-1.1,0-2-0.9-2-2v-2h8v2C108,96.1,107.1,97,106,97z"
                />
              </g>
              <path
                ref={noseRef}
                className="nose"
                d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z"
                fill="#3a5e77"
              />
              <g className="arms" clipPath="url(#armMask)">
                <g
                  ref={armLRef}
                  className="armL"
                  style={{ visibility: "hidden" }}
                >
                  <polygon
                    fill="#DDF1FA"
                    stroke="#3A5E77"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    points="121.3,98.4 111,59.7 149.8,49.3 169.8,85.4"
                  />
                  <path
                    fill="#DDF1FA"
                    stroke="#3A5E77"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    d="M134.4,53.5l19.3-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-10.3,2.8"
                  />
                  <path
                    fill="#DDF1FA"
                    stroke="#3A5E77"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    d="M150.9,59.4l26-7c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-21.3,5.7"
                  />
                  <g ref={twoFingersRef} className="twoFingers">
                    <path
                      fill="#DDF1FA"
                      stroke="#3A5E77"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit="10"
                      d="M158.3,67.8l23.1-6.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-23.1,6.2"
                    />
                    <path
                      fill="#A9DDF3"
                      d="M180.1,65l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L180.1,65z"
                    />
                    <path
                      fill="#DDF1FA"
                      stroke="#3A5E77"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit="10"
                      d="M160.8,77.5l19.4-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-18.3,4.9"
                    />
                    <path
                      fill="#A9DDF3"
                      d="M178.8,75.7l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L178.8,75.7z"
                    />
                  </g>
                  <path
                    fill="#A9DDF3"
                    d="M175.5,55.9l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L175.5,55.9z"
                  />
                  <path
                    fill="#A9DDF3"
                    d="M152.1,50.4l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L152.1,50.4z"
                  />
                </g>
                <g
                  ref={armRRef}
                  className="armR"
                  style={{ visibility: "hidden" }}
                >
                  <path
                    fill="#ddf1fa"
                    stroke="#3a5e77"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeWidth="2.5"
                    d="M265.4 97.3l10.4-38.6-38.9-10.5-20 36.1z"
                  />
                  <path
                    fill="#ddf1fa"
                    stroke="#3a5e77"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeWidth="2.5"
                    d="M252.4 52.4L233 47.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l10.3 2.8M226 76.4l-19.4-5.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l18.3 4.9M228.4 66.7l-23.1-6.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l23.1 6.2M235.8 58.3l-26-7c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l21.3 5.7"
                  />
                  <path
                    fill="#a9ddf3"
                    d="M207.9 74.7l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM206.7 64l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM211.2 54.8l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM234.6 49.4l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8z"
                  />
                </g>
              </g>
            </svg>
          </div>
        </SvgContainer>

        <InputGroup>
          <label htmlFor="loginEmail">Email</label>
          <input
            type="email"
            id="loginEmail"
            ref={emailRef}
            maxLength="254"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              onEmailInput();
            }}
            onFocus={() => {
              calculateFaceMove();
              if (eyesCovered) uncoverEyes(); // Bỏ tay ra nếu đang che mắt
            }}
            onBlur={() =>
              !email &&
              gsap.to([eyeLRef.current, eyeRRef.current], {
                x: 0,
                y: 0,
                duration: 1,
                ease: "expo.out",
              })
            }
          />
        </InputGroup>

        <InputGroup>
          <label htmlFor="loginPassword">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="loginPassword"
            ref={passwordRef}
            value={password}
            onChange={(e) =>{ setPassword(e.target.value);
              }
            }
            onFocus={() => {
              resetFace(); // Chỉ đặt lại mặt, không ảnh hưởng đến tay
              if (!eyesCovered) coverEyes(); // Che mắt nếu chưa che
            }}
            onBlur={() => !eyesCovered && uncoverEyes()}
          />
          <PasswordToggle checked={showPassword}>
            Show
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => {
                setShowPassword(!showPassword);
                showPassword ? closeFingers() : spreadFingers();
              }}
            />
            <div className="indicator"></div>
          </PasswordToggle>
          <ForgotPasswordLink
            type="button"
            onClick={()=>history.push("/register")}
          >
            Register
          </ForgotPasswordLink>
        </InputGroup>

        <InputGroup>
          <button type="submit">Log in</button>
          <SocialButtonContainer>
            <SocialButton
              type="button"
              onClick={() => handleLoginGG(googleProvider)}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" />
            </SocialButton>
            <SocialButton type="button" onClick={() => handleLoginGG(fbProvider)}>
              <img src="https://www.facebook.com/favicon.ico" alt="Facebook" />
            </SocialButton>
          </SocialButtonContainer>
        </InputGroup>
      </Form>
    </Container>
  );
}
