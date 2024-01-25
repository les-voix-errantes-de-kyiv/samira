
import * as THREE from 'three'
import './App.css';
import React, { useEffect, useState, useRef, us } from 'react';
import { Canvas, _roots, useFrame , useThree} from '@react-three/fiber'
import Card from './Card.jsx';
import { Image, Environment, ScrollControls, useScroll, useTexture, OrbitControls } from '@react-three/drei';
import { easing , geometry} from 'maath'
import Statue from './Statue';
import TextCard from './TextCard.jsx';
import Spiral from './Spiral.jsx';

let sense = 1; // 1 or -1
let senseZ = -1; // 1 or -1
let loopPoint = 1;

function App() {

  const [scrollY, setScrollY] = useState(0);
  const [opacity, setOpacity] = useState(1); // Opacité initiale

  useEffect(() => {

    const test = document.querySelector('div.canvas-container:last-child')
    console.log(test)

    const handleScroll = () => {
      const newScrollY = window.scrollY;

      // Calculer l'opacité en fonction de la position du scroll
      const newOpacity = 1 - newScrollY / 500; // Modifiez 500 selon vos besoins

      // Limiter l'opacité entre 0 et 1
      const limitedOpacity = Math.max(0, Math.min(1, newOpacity));

      setScrollY(newScrollY);
      setOpacity(limitedOpacity);
    };

    test.addEventListener('scroll', handleScroll);
  
    return () => {
      test.removeEventListener('scroll', handleScroll);
    };
  }, [scrollY,opacity]);

  return (
    <div className="canvas-container">

    <div class="hud-cust" id="hudcust" style={{opacity}}>

      <div class="hud-title">Samira's journey</div>
      <div class="hud-why">Why ?</div>
      <div class="hud-langs"></div>
      <div class="explore-block">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam minima exercitationem, sunt ad odit suscipit cum commodi earum dolore, libero esse autem corrupti quidem accusantium. Sit eius voluptates pariatur aut!</p>
        <div class="explore-btn">EXPLORE</div>
      </div>

    </div>

      <Canvas camera={{ position: [0, 2, 40], fov: 15 }}>
        <fog attach="fog" args={['#a79', 8.5, 12]} />
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.45} penumbra={1} decay={0} intensity={2} />
        <pointLight position={[-10, -10, -10]} decay={1} intensity={1} />
        <ScrollControls pages={12} >
          <Rig rotation={[0, Math.PI, 0]}>
            {/*<Spiral rotation={[0, Math.PI  , 0] }position={[0, 0, 0]} scale={[0.055, 0.055, 0.055]} scrollY={scrollY}  />*/}
            <Cards />
          </Rig>
          <Axis rotation={[0, 0, 0]}>
            <Statue />
          </Axis>
          {/* <gridHelper args={[10, 10]} /> */}
        </ScrollControls>
        
        { /*<OrbitControls />*/ }
      </Canvas>
    </div>
  );
}

export default App;

function Rig(props) {
  const ref = useRef()
  const scroll = useScroll()
  useFrame((state, delta) => {
    ref.current.rotation.y = -scroll.offset * (Math.PI * 4) * 1.002 // Rotate contents
    ref.current.position.y = scroll.offset * (Math.PI * 3)// Move contents
    state.events.update() // Raycasts every frame rather than on pointer-move
  })
  return <group ref={ref} {...props} />
}
function Axis(props) {
  const ref = useRef()
  const scroll = useScroll()
  useFrame((state, delta) => {
    ref.current.rotation.y = -scroll.offset * (Math.PI ) * 1.002 // Rotate contents
    ref.current.scale.set(0.8 + scroll.offset * 0.7, 0.8 + scroll.offset * 0.7, 0.8 + scroll.offset * 0.7) 
    state.events.update() // Raycasts every frame rather than on pointer-move
    state.camera.lookAt(0, 0, 20) // Look at center
  })
  return <group ref={ref} {...props} />
}

function Cards() {
  const numberOfCards = 10;
  var objPerTurn = 2;
  let lastPosition = 0;

  const cardPosition = (i, lastPosition, sense, senseZ) => {
    const step = 1.15;
    const position = new THREE.Vector3();
    const radius = 2; // radius of the spiral

    if(loopPoint == 1){

      position.x =  radius * sense ;
      position.z = 0 ;


      if(sense == 1){ position.rotationY = Math.PI/2 + Math.PI }else if(sense == -1){ position.rotationY = Math.PI/2 }

    }else if (loopPoint == -1){

      position.x =  0 ;
      position.z = radius * senseZ ;

      if(senseZ == 1){ position.rotationY = Math.PI*2 + Math.PI }else if(senseZ == -1){ position.rotationY = Math.PI*2 }

    }
    position.y = -(i * step + 1) + 2.5// y is always negative (decreasing)
    // console.log("position: " + i, position);
    return position;
  };

  return Array.from({ length: numberOfCards  , sense, senseZ }, (_, i) => {

    if(loopPoint == 1){ sense *= -1; }else if (loopPoint == -1){ senseZ *= -1; }
    loopPoint *= -1;

    // 
    const position = cardPosition(i, lastPosition, sense, senseZ); // Call the function to get the position
    lastPosition = position.y;
    if (i % 2 === 0 ){
      // console.log('Position Image Card: ', position)
    } else {
      console.log('Position Text Card: ', position)
    }
  
    const cardUrl = `/img${Math.floor(i % 10) + 1}_.png`;
    const textUrl = `/img1_txt.png`;
    // For text, you can set a default text or modify it based on your requirements
    return (
      // <group key={i}>
      //   <Card
      //       url= {i % 2 === 0 ? cardUrl : textUrl}
      //       position= {[position.x, position.y, position.z]}
      //       rotation={i % 2 === 0 ? [0, position.rotationY, 0] : [0, Math.PI / 2, 0 ]}
      //     />
          
      // </group>
      <group key={i}>
        {/* {i % 2 === 0 ? ( // Check if i is even
          <Card
            url={cardUrl}
            position={[position.x, position.y, position.z]}
            rotation={[0,0, 0]}
            text={`Card ${i}`}
          />
        ) : ( // i is odd
          <TextCard
          url={textUrl}
          position={[position.x, position.y, position.z]}
          rotation={[0, Math.PI /2 * loopPoint, 0]}
          />
        )} */}
        <Card
          key={i}
          url={`/img${Math.floor(i % 10) + 1}_.png`}
          position={[position.x, position.y, position.z]}
          text={`Card ${i}`}
          rotation={[0,  position.rotationY, 0]}
        />
        <TextCard
          url={textUrl}
          position={[position.x -0.1, position.y - 0.1, position.z +( 0.3)* -loopPoint]}
          rotation={[0, 0, 0]}
          />
      </group>
    );

  });
  
}
