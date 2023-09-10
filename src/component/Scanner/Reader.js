import React, { useState, useContext } from "react";
import { Scancontext } from "../../App";
import Scanner from "./Scanner";
import { Button } from "@chakra-ui/react"

const Index = () => {
    const [camera, setCamera] = useState(false);
    const [, setCode] = useContext(Scancontext);

    const startScanner = () => {
        setCamera(true); // カメラを起動
    };

    const onDetected = result => {
    if (camera){
        setCode(result);
        setCamera(!camera);
        console.log(result);
    }
    };

    return (
    <section className="section-wrapper">
        <div className="section-title">
        <h1 className="section-title-text">
        {camera ? <Scanner onDetected={onDetected} /> : <Button colorScheme='blue' onClick={startScanner}>カメラで読込</Button>}
        </h1>
        </div>
    </section>
    );
}

export default Index