import React, {createContext, useEffect} from "react";
import Reader from './component//Scanner/Reader';
import { ChakraProvider } from "@chakra-ui/react";
import {
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  HStack,
  Button,
  VStack,
  Card, CardHeader, CardBody, CardFooter,
  Stack,
  Heading,
  Text,
  StackDivider
} from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

import { useState } from "react";
import axios from "axios";

import "./App.css"

export const Scancontext = createContext();

const App = () => {  
  const url = "https://webapp-class1to4-4-con.azurewebsites.net/";
  // const url = " http://127.0.0.1:8000/";

  const [productslist, setProducts] = useState([]);
  // const [groupedProducts, setGroupedProducts] = useState([])
  const [product, setProduct] = useState({PRD_CODE:"",NAME:"", PRICE: "", PRNAME:"",DISCOUNT:0});
  const [totalprice, setTotalprice]=useState()
  const [selectedRow, setSelectedRow] = useState(0);
  const [newcount, setNewcount] = useState("")
  const [code, setCode] = useState(null);

  const ClickGet = async(code) =>{
    try {
      const response = await axios.get(url + "search_product/" + code);
      // console.log("response",response.data)

      if(response.data === "null" ){
        setProduct({id : "null",NAME:"商品がマスタ未登録です", PRICE:""})
      }else{
        setProduct(response.data)
        const product = response.data
        const count = product.COUNT
        const price = product.PRICE
        const discount = product.DISCOUNT

        const totalPrice = price * count;
        const totalDiscount = discount * count;
        const finalPrice = (price - discount) * count;

        const updatedProduct = {
          ...product,  // 既存のプロパティを維持
          TOTALPRICE: totalPrice,  // 合計価格をセット
          TOTALDISCOUNT: totalDiscount,  // 合計割引をセット
          FINALPRICE: finalPrice  // 最終価格をセット
        };
        clickAdd(updatedProduct)
        setSelectedRow(productslist.length)
      };

    } catch (error) {
      console.error("Error submitting data:", error);
    };
  };


  const clickAdd = (product) =>{
    
    if(product.PRICE !==""){

      const products = [...productslist];
      products.push(product)
      setProducts(products)
      }
    };
    
  const getnewCount = (count)=>{
    setNewcount(count)
  };
    
  const countChange = (count, index)=>{

    // console.log("count",index, "product", productslist [index])
    // const updateedlist = [...productslist];
    // for (let i = 0; i < count-1; i++) {
    //   updateedlist.push({
    //     PRD_ID: groupedProducts [index].id,
    //     PRD_CODE: groupedProducts [index].prd_code,
    //     NAME: groupedProducts [index].name,
    //     PRICE: groupedProducts [index].price,
    //     PRNAME: groupedProducts [index].prname,
    //     DISCOUNT: groupedProducts [index].discount
    //     });
    const updateedlist = [...productslist];

    const price = productslist[index].PRICE;
    const discount = productslist[index].DISCOUNT;

    const totalPrice = price * count;
    const totalDiscount = discount * count;
    const finalPrice = (price - discount) * count;
    updateedlist[index] = {
          ...productslist[index],
          COUNT: count,
          TOTALPRICE: totalPrice,  // 合計価格をセット
          TOTALDISCOUNT: totalDiscount,  // 合計割引をセット
          FINALPRICE : finalPrice
        };

    console.log("expandlist", updateedlist)
    setProducts(updateedlist)
  };
  
  const handleRemoveProduct = (index) => {
    // 商品を削除
    const updatedGroupedProducts = [...productslist];
    updatedGroupedProducts.splice(index, 1);
    // setGroupedProducts(updatedGroupedProducts);
    setProducts(updatedGroupedProducts)
  };

  useEffect(() => {

        // const grouped_Products = []
    // productslist.forEach(product => {

    // const existingProduct = grouped_Products.find(groupedProduct => groupedProduct.name === product.NAME);
  
    // if (existingProduct) {
    //   existingProduct.count += 1;
    //   existingProduct.totalPrice = product.PRICE * existingProduct.count;
    //   existingProduct.totaldiscount = product.DISCOUNT * existingProduct.count;
    //   existingProduct.final_price = (product.PRICE - product.DISCOUNT) * existingProduct.count;
    //   console.log(product.PERCENT, existingProduct.totaldiscount )
    // } else {
    //   grouped_Products.push({
    //     id : product.PRD_ID,
    //     prd_code: product.PRD_CODE,
    //     name: product.NAME,
    //     price: product.PRICE,
    //     count: 1,
    //     prname : product.PRNAME,
    //     totalPrice: product.PRICE,
    //     discount : product.DISCOUNT,
    //     totaldiscount: product.DISCOUNT,
    //     final_price: product.PRICE-product.DISCOUNT
        
    //   });
    //   console.log("check", product.DISCOUNT, product.PRICE-product.DISCOUNT)
    // }
    // });
    // console.log("grouped_Products", grouped_Products)

    // すべての final_price を合計するための変数を初期化
    let totalFinalPrice = 0;

    // grouped_Products 配列をイテレートして final_price を合計
    productslist.forEach(product => {
      console.log("pricing",product.NAME, product.FINALPRICE)
      totalFinalPrice += product.FINALPRICE;
    });

    // setGroupedProducts(grouped_Products)
    // setProducts(updateedlist)
    setTotalprice(totalFinalPrice)
    // setCart(grouped_Products.map((product) => <li key={product.name}>
    //   {product.name} × {product.count} {product.price}円  計{product.totalPrice}円</li>));
    // setTotalprice(productslist.reduce((total, product) => total + product.PRICE, 0));
  },[productslist]
  );

  useEffect(() => {
    if(code!==null){
      ClickGet(code)
    };
    // eslint-disable-next-line
    },[code]
    );

  // grouped_ProductsをProductモデルに合わせて変換する関数
  function convertToProductModel(productData) {
  return {
    PRD_ID: productData.PRD_ID, // PRD_IDにidを設定
    PRD_CODE: productData.PRD_CODE, // CODEは指定なしの場合はnull
    NAME: productData.NAME,
    PRICE: productData.PRICE,
    COUNT: productData.COUNT
  };
}

  const clickBuy = async() =>{
    
    // JavaScriptのDateオブジェクトを作成
    // grouped_Productsの各要素をProductモデルに変換
    const convertedProducts = productslist.map(productData => convertToProductModel(productData));
    
    const buy_data = {
      MEM_ID: 2,
      EMP_CODE : 12,
      STORE_CODE : 30,
      POS_ID : 90,
      BUYPRODUCTS: convertedProducts
    }
    console.log(buy_data)

    try {
      
      const response = await axios.post(url + "buy_product/", buy_data);
      console.log("response",response.data)
      // setTotalprice([response[1],response[2]])

      alert(`合計金額は${response.data[1]}円(税抜)、${response.data[2]}円（税込）です。`)
      setProducts([])
      setProduct("")
      setProduct("")
      // setGroupedProducts([])

    } catch (error) {
      console.error("Error submitting data:", error);
    };


  };

  const sendMessage = async(userid) =>{
    const text = "test"
    try{
      axios.post(url + "promotion/" + userid, text);
    } catch (error) {
      console.error("Error submitting data:", error);
    };
  }

  return (
    <>
      <ChakraProvider>
        <VStack p={10} spacing='4'>
        <Scancontext.Provider value={[code, setCode]}>
          <HStack>
            <Editable h = "40px"w = "250px" borderWidth="1px" borderRadius='lg' value = {code || "コードを入力またはカメラで読込"} >
              <EditablePreview />
              <EditableInput
                type="text"
                id = "code"  
                onChange={(e) => {
                  ClickGet(e.target.value);
                  const newValue = e.target.value;
                  if (newValue !== code) {
                    // 新しい値が現在の値と異なる場合のみ更新する
                    setCode(newValue);
                  }
                }}
              />
            </Editable>
            <Reader />
          </HStack>
        </Scancontext.Provider>
        
          <Card key="card" w="380px" h="180px" >
            <CardHeader>
              <Heading size='md'>商品情報</Heading>
            </CardHeader>

            <CardBody>
              <Stack spacing='4'>
                <Text>商品名：{product["NAME"]}</Text>
                <HStack>
                  <Text>価格：{product["PRICE"]}{product["PRICE"] === "" ? "" : "円 × "}</Text>
                  <Editable 
                      h = "40px"
                      w = "100px" 
                      borderWidth="1px" 
                      borderRadius='lg'
                      textAlign="center" // テキストを水平方向に中央に配置
                      display="flex"
                      alignItems="center" // テキストを垂直方向に中央に配置
                      justifyContent="center" // テキストを水平方向に中央に配置
                      placeholder={
                        productslist.length === 0 ? " " : productslist[selectedRow].COUNT
                      }
                  >
                  <EditablePreview />
                  <EditableInput
                    type="number"
                    id="count"
                    onChange={(e) => getnewCount(e.target.value)}
                  />
                  </Editable>
                  </HStack>
              </Stack> 
            </CardBody>
          </Card>
                  
        <HStack>
          <Button colorScheme='blue' onClick={() => handleRemoveProduct(selectedRow)}>削除</Button>
          <Button colorScheme='blue' onClick={(e) => countChange(newcount, selectedRow)}>数量の変更</Button>
        </HStack>
        {/* <Button colorScheme='blue' onClick={clickAdd}>商品の追加</Button> */}
        <Card key="list" w="380px" >

          <CardHeader>
                <Heading size='md'>購入リスト</Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing='4'>
          {productslist.map((product, index) => {
            const isTotalDiscountPositive = product.TOTALDISCOUNT > 0;
            
            return (
              <Stack>
                <HStack mb="1" style={{ fontWeight: selectedRow === index ? 'bold' : 'normal' }}>
                  <Text fontSize="sm">{product.NAME} </Text>
                  <Text fontSize="sm"> {product.PRICE}円</Text>
                  <Text fontSize="sm"> ×{product.COUNT}</Text>
                  <Text fontSize="sm"> {product.TOTALPRICE}円</Text>
                  <IconButton
                    aria-label="Minus button"
                    size="xs"
                    icon={<CheckCircleIcon color="blue.500" />}
                    backgroundColor="white"
                    border="2px solid"
                    borderColor="blue.500"
                    borderRadius="50%"
                    onClick={() => {
                      setSelectedRow(index);
                      setProduct({ PRD_CODE: product.PRD_CODE, NAME: product.NAME, PRICE: product.PRICE,COUNT: product.COUNT });
                    }}
                  />
                </HStack>
                {isTotalDiscountPositive && (
                  <HStack 
                  mb="1"
                  style={{ fontWeight: selectedRow === index ? 'bold' : 'normal'}}>
                    <Text> </Text>
                    <Text>{product.PRNAME}</Text>
                    <Text>(- {product.TOTALDISCOUNT})円</Text>
                    {/* <Text>{product.PRICE-product.DISCOUNT}円</Text> */}
                    <Text>{product.FINALPRICE}円</Text>
                  </HStack>
                )}
              </Stack>
            );
          })}
            </Stack>
          </CardBody>
        {/* <Box w='400pX' h ="300px"color='black' borderWidth='1px' borderRadius='lg' >{cart}</Box> */}
          <CardFooter>
            <Text as='b' fontSize='xl'>購入金額：{totalprice}円</Text>
          </CardFooter>
        </Card>
        <Button colorScheme='blue' onClick={clickBuy}>購入する</Button>
        <Button colorScheme='blue' onClick={() => sendMessage("U32a6630aaeb4fa84c9c7fb34c23a59e7")}>テキスト送信</Button>
        </VStack>
      </ChakraProvider>
    </>
  );

}
export default App;