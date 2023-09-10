import React, {createContext, useContext,useEffect} from "react";
import Reader from './component//Scanner/Reader';
import { ChakraProvider } from "@chakra-ui/react";
import {
  Editable,
  EditableInput,
  EditablePreview,
} from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { VStack } from "@chakra-ui/react";
import { Box } from '@chakra-ui/react'

import { useState } from "react";
import axios from "axios";

export const Scancontext = createContext();

const App = () => {  
  const url = "https://webapp-class-4-1.azurewebsites.net/";
  const [buyproducts, setProducts] = useState([]);
  const [product, setProduct] = useState({productcode:"",NAME:"", PRICE: ""});
  const [cart, setCart]=useState(["",""]);
  
  const [code, setCode] = useState(null);

  const ClickGet = async() =>{
    try {
      const response = await axios.get(url + "search_product/" + code);
      console.log("response",response.data)

      if(response.data === "null" ){
        setProduct({id : "null",NAME:"商品がマスタ未登録です", PRICE:""})
      }else{
        setProduct(response.data)
      };

    } catch (error) {
      console.error("Error submitting data:", error);
    };
  };

  const clickAdd = () =>{
    
    if(product.PRICE !==""){
    const newproducts = [...buyproducts];
    newproducts.push(product)
    setProducts(newproducts)
    }
    };
  
  
  useEffect(() => {

  const groupedProducts = []

  buyproducts.forEach(product => {
    const existingProduct = groupedProducts.find(groupedProduct => groupedProduct.name === product.NAME);
  
    if (existingProduct) {
      existingProduct.count++;
      existingProduct.totalPrice += product.PRICE;
    } else {
      groupedProducts.push({
        name: product.NAME,
        price: product.PRICE,
        count: 1,
        totalPrice: product.PRICE
      });
    }
    });
  
    setCart(groupedProducts.map((product) => <li key={product.name}>
      {product.name} × {product.count} {product.price}円  計{product.totalPrice}円</li>));
    // setTotalprice(buyproducts.reduce((total, product) => total + product.PRICE, 0));
  },[buyproducts]
  );



  const clickBuy = async() =>{
    
    console.log(buyproducts)
    // JavaScriptのDateオブジェクトを作成
    
    const buy_data = {
      EMP_CD : 12,
      STORE_CD : 30,
      POS_NO : 90,
      BUYPRODUCTS: buyproducts
    }

    try {
      
      const response = await axios.post(url + "buy_product/", buy_data);
      console.log("response",response.data)
      // setTotalprice([response[1],response[2]])

      alert(`合計金額は${response.data[1]}円(税抜)、${response.data[2]}円（税込）です。`)
      setProducts([])
      setProduct("")

    } catch (error) {
      console.error("Error submitting data:", error);
    };


  };

  console.log("code",code)


  return (
    <>
      <ChakraProvider>
        <VStack p={10} spacing='4'>
        <Scancontext.Provider value={[code, setCode]}>
            <Reader />
            <Editable w = "250px" borderWidth="1px" borderRadius='lg' value = {code || "コードを入力またはカメラで読込"} >
            <EditablePreview />
            <EditableInput
              type="text"
              id = "code"  
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue !== code) {
                  // 新しい値が現在の値と異なる場合のみ更新する
                  setCode(newValue);
                }
              }}
          />
          </Editable>
        </Scancontext.Provider>
        {/* <div className="codeinput">
          <input type="text" id = "code" placeholder ="コードを入力してください"  onChange={(e) => {
            setCode(e.target.value)
          }}
          />  */}
        {/* </div> */}
        <Button colorScheme='blue' onClick={ClickGet}>商品コードの読み込み</Button>
    
        <div>
          <h3 className="productname">{product["NAME"]}</h3>
          <h3 className="productname">{product["PRICE"]}{product["PRICE"] ==="" ? "":"円" }</h3>
        </div>
        </VStack>
        <VStack p={2} spacing='10'>
        
        <Button colorScheme='blue' onClick={clickAdd}>商品の追加</Button>
        <h3 >購入商品一覧</h3>
        <Box w='400pX' h ="300px"color='black' borderWidth='1px' borderRadius='lg' >{cart}</Box>
        <Button colorScheme='blue' onClick={clickBuy}>購入する</Button>
        </VStack>
      </ChakraProvider>
    </>
  );

}
export default App;