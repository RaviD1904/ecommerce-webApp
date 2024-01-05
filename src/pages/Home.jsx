import {
  Button,
  Input,
  Select,
  useToast,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Image,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cartItms, setCartItms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const toast = useToast();
  const userId = sessionStorage.getItem("userID");
  useEffect(() => {
    getAllProdcuts();
    // getCartItem()
  }, []);

  const getCartItem = async () => {
    const res = await fetch(`https://dummyjson.com/carts/user/${userId}`);
    const result = await res.json();
    setCartItms(result?.carts[0]);
    console.log(result?.carts[0]?.products);
  };

  const handelAddToCard = async (productId) => {
    setLoading(true);
    try {
      const res = await fetch("https://dummyjson.com/carts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          products: [
            {
              id: productId,
              quantity: 1,
            },
          ],
        }),
      });
      const result = await res.json();
      if (result.products.length > 0) {
        setLoading(false);
        toast({
          title: `Product Added to Cart`,
          status: "success",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
      } else {
        setLoading(false);
        toast({
          title: `Product Add to Cart Failed`,
          status: "error",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
      }
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };
  const handleSearch = async (e) => {
    if (e.key == "Enter") {
      try {
        const res = await fetch(
          `https://dummyjson.com/products/search?q=${search}`
        );
        const result = await res.json();
        if (result?.products.length > 0) {
          setProducts(result.products);
        } else {
          alert("Product not found");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getAllProdcuts = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://dummyjson.com/products");
      const result = await res.json();
      result?.products && setProducts(result.products);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Fetching Product Fail.",
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleSelect = (e) => {
    if (e.target.value == "lth") {
      const sortedProductsByPrice = products?.sort((a, b) => {
        return a.price - b.price;
      });
      console.log(sortedProductsByPrice);
      setProducts(sortedProductsByPrice);
    } else {
      const sortedProductsByPriceHightoLow = products?.sort((a, b) => {
        return b.price - a.price;
      });
      console.log(sortedProductsByPriceHightoLow);
      setProducts(sortedProductsByPriceHightoLow);
    }
  };
  return (
    <div>
      <div className="flex justify-evenly align-middle py-8">
        <Input
          width="400px"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          onKeyDown={handleSearch}
          placeholder="Search Product...Hit Enter"
        />
        <Select
          placeholder="Select option"
          width="200px"
          onChange={handleSelect}
          style={{ textAlign: "center" }}
        >
          <option value="lth">Price:Low To High</option>
          <option value="htl">Price:High To Low </option>
        </Select>
        <Button
          ref={btnRef}
          colorScheme="teal"
          onClick={() => {
            onOpen();
            getCartItem();
          }}
        >
          Cart
        </Button>
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              Your Cart Items{" "}
              <span
                style={{
                  border: "1px solid blue",
                  borderRadius: "50%",
                  textAlign: "center",
                  fontSize: "24px",
                  padding: "10px",
                }}
              >
                {cartItms?.totalProducts}
              </span>
            </DrawerHeader>
            <DrawerBody>
              <div>
                <TableContainer>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Price</Th>
                        <Th isNumeric>Quantity</Th>
                        <Th isNumeric>Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {cartItms?.products?.map((product) => {
                        return (
                          <Tr key={product.id}>
                            <Td>{product.title}</Td>
                            <Td>{product.price}</Td>
                            <Td isNumeric>{product.quantity}</Td>
                            <Td isNumeric>{product.total}</Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </div>
            </DrawerBody>

            <DrawerFooter>
              <div className="flex justify-evenly align-middle">
                <div>
                  <p
                    style={{
                      fontSize: "19px",
                      textAlign: "center",
                      marginRight: "60px",
                    }}
                  >
                    Total: ${cartItms?.total}
                  </p>
                </div>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Cancel
                </Button>
              </div>

              {/* <Button colorScheme='blue'>Save</Button> */}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div>
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Customers also purchased
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {products?.map((product) => (
                <div key={product.id} className="group relative">
                  <Card maxW="sm" minH="550px">
                    <CardBody>
                      <Image
                        src={product.thumbnail}
                        style={{
                          height: "150px",
                        }}
                        alt={product.title}
                        borderRadius="lg"
                      />
                      <Stack mt="6" spacing="3">
                        <Heading size="md">{product.title}</Heading>
                        <Text>{product.description}</Text>
                        <Text color="blue.600" fontSize="2xl">
                          ${product.price}
                        </Text>
                      </Stack>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                      <ButtonGroup spacing="2">
                        {/* <Button variant="solid" colorScheme="blue">
                      Buy now
                    </Button> */}
                        <Button
                          variant="solid"
                          colorScheme="blue"
                          onClick={() => handelAddToCard(product.id)}
                        >
                          Add to cart
                        </Button>
                      </ButtonGroup>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
