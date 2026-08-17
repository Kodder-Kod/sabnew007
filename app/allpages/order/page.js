"use client"
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { ref, push, update } from 'firebase/database';
import { MdEmail } from "react-icons/md"
import { db, } from "../../../config";
import { FaUser, FaTerminal, FaClock, FaBox, FaList, FaFile, FaEject, FaProductHunt, FaBoxOpen, FaExpand, FaFolder, FaTags, FaReceipt, FaUsers } from "react-icons/fa";
import { useUserCategories } from "@/app/componets/zustand/categories";
import { useUserAccountName, useUserEmail, useUserID, useUserName, useUserPhone } from "@/app/componets/zustand/profile";
import { useUserItems, useUserItemsData } from "@/app/componets/zustand/items";
import { useUserEmployee } from "@/app/componets/zustand/employees";
import itemsdata from "@/app/data/items";
import categoriesdata from "@/app/data/categories";
import { useUserTheme } from "@/app/componets/zustand/theme";
import { TbXboxX } from "react-icons/tb";
import { TiTick } from "react-icons/ti";
import { QRCodeSVG } from 'qrcode.react';
import { useUserCartReceipt, useUserCartTotalReceipt } from "@/app/componets/zustand/receipt";
import { FaCashRegister } from "react-icons/fa";
import { useUserOrders } from '@/app/componets/zustand/orders';


const Orders = () => {

  //// Zustand 
  const Id = useUserID((state) => state.userID)
  const categories = useUserCategories((state) => state.userCategories)
  const items = useUserItems((state) => state.userItems)
  const orders = useUserOrders((state) => state.userOrders)
  const bizName = useUserName((state) => state.userName)
  const userAccountName = useUserAccountName((state) => state.userAccountName)

  const bizEmail = useUserEmail((state) => state.userEmail)
  const bizPhone = useUserPhone((state) => state.userPhone)

  const employees = useUserEmployee((state) => state.userEmployee)

  const theme = useUserTheme((state) => state.userTheme)


  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentError, setPaymentError] = useState("");


  // State to track the selected category
  const [selectedCategory, setSelectedCategory] = useState("");

  /////// Select box   mostly for employees
  const [selectEmployee, setSelectEmployee] = useState("");
  const [ticketName, setTicketName] = useState('');

  /// Cart functions 
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  const selectCat = (catname) => {
    if (catname === selectedCategory) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(catname);
    }

    // Clear search when selecting category
    setSearchTerm("");
  };


  let filteredItems = items || [];

  // Search overrides category completely
  if (searchTerm.trim() !== "") {

    const q = searchTerm.toLowerCase();

    filteredItems = (items || []).filter((item) =>
      (item.Name || "").toLowerCase().includes(q)
    );

  } else if (selectedCategory) {

    filteredItems = filteredItems.filter(
      (item) => item.Category === selectedCategory
    );
  }


  ///// Modals
  const [ticketModal, setTicketModal] = useState(false)
  const [receiptDetailsModal, setreceiptDetailsModal] = useState(false)
  const [sendModal, setSendModal] = useState(false);
  const [receiptModal, setReceiptModal] = useState(false);


  const receiptModalFun = () => setReceiptModal(false);

  const sendModalFun = () => {
    setSelectEmployee("")
    setTicketName('')
    setPaymentMethod('')
    setSendModal(false);
  }

  const ticketModalFun = () => {
    setTicketName('')
    setSelectEmployee("")

    setTicketModal(false);
  }

  const [phoneNumber, setPhoneNumber] = useState('');
  const [sendMpesa, setSendMpesa] = useState(false);
  const sendMpesaFun = () => {
    setSelectEmployee("")
    setTicketName('')
    setSendMpesa(false);
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("total:", total, "type:", typeof total);
    console.log("total:", phoneNumber, "type:", typeof phoneNumber);

    try {
      await axios.post('/api/mpesa', { phoneNumber, total });
      //  setMessage("STK Push sent. Enter PIN on your phone!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Payment failed.';
      console.log(err.response?.data?.message)

    } finally {
      console.log("finally")
      //  setLoading(false);
    }
  };


  const receiptDetailsModalFun = () => {

    setreceiptDetailsModal(false);
  }

  /////receipt details modal 
  const [receiptName, setReceiptName] = useState('');
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [receiptNumber, setReceiptNumber] = useState("")

  useEffect(() => {
    const now = new Date();

    const formattedDate = now.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

    const formattedTime = now.toLocaleTimeString('en-KE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const receiptNumber1 = 'MRCS' + Math.floor(100000 + Math.random() * 900000); // Example generator

    setReceiptNumber(receiptNumber1)
    setSelectedDate(formattedDate);
    setSelectedTime(formattedTime);
  }, []);


  const receiptDetailsClose = () => {
    setReceiptModal(true);

    setreceiptDetailsModal(false)
  }

  // const cart = useUserCartReceipt((state) => state.userCartReceipt)


  const addToCart = (item) => {
    const unlimited = item.Stock == "N/A";

    // If stock is numbered and zero → block
    if (!unlimited && item.Stock <= 0) {
      itemOutStockFun();
      return;
    }

    const existingItem = cart.find(
      (cartItem) => cartItem.Name === item.Name
    );

    if (existingItem) {
      // Numbered stock limit check
      if (!unlimited && existingItem.stock >= item.Stock) {
        itemMaxFun();
        return;
      }

      setCart(
        cart.map((cartItem) =>
          cartItem.Name === item.Name
            ? { ...cartItem, stock: cartItem.stock + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, stock: 1 }]);
    }

    setTotal(total + parseFloat(item.Price));
  };

  const handleIncrease = (item) => {
    const unlimited = item.Stock == "N/A";

    if (!unlimited && item.stock >= item.Stock) {
      itemMaxFun();
      return;
    }

    setCart(
      cart.map((cartItem) =>
        cartItem.Name === item.Name
          ? { ...cartItem, stock: cartItem.stock + 1 }
          : cartItem
      )
    );

    setTotal(total + parseFloat(item.Price));
  };


  const handleDecrease = (item) => {
    if (item.stock > 1) {
      setCart(
        cart.map((cartItem) =>
          cartItem.Name === item.Name
            ? { ...cartItem, stock: cartItem.stock - 1 }
            : cartItem
        )
      );
      setTotal(total - parseFloat(item.Price));
    } else {
      handleRemove(item);
    }
  };

  const handleRemove = (item) => {
    setCart(cart.filter((cartItem) => cartItem.Name !== item.Name));
    setTotal(total - parseFloat(item.Price) * item.stock)

  };

  const generateRandomHex = () => {
    const receiptNumber1 = 'MRCS' + Math.floor(100000 + Math.random() * 900000);
    return receiptNumber1;
  };


  ///ticket function 
  const handleticket = () => {
    if (Id) {
      if (cart) {

        try {

          const hexTicket = generateRandomHex();
          const dbRef = ref(db, `web/pos/${Id}/consumed/`);
          const newbranchRef = push(dbRef, {


            EmployeeID: userAccountName,
            CashSale: hexTicket,
            Cart: cart,
            Date: Date.now()

          });
          const newCreditKey = newbranchRef.key;

          ticketModalFun()
          handleCancel()
          ticketSuccess()


          updateStockInDatabase(Id);


        }
        catch {
          console.log("did not send to DB")
          ticketModalFun()
          ticketFail()
        }

      }
      else {
        console.log("did not select employee ")
        ticketModalFun()
        ticketFailEmployee()
      }
    }


  };



  //// send cart to the database 
  const handleSend = () => {
    if (Id) {

      if (cart && cart.length > 0) {

        try {
          const hexTicket = generateRandomHex();

          const dbRef = ref(db, `web/pos/${Id}/orders/`);

          const newbranchRef = push(dbRef, {

            EmployeeID: userAccountName,
            CashSale: hexTicket,
            Cart: cart,
            Total: total,
            Approved: "N/A",
            Received: "N/A",
            DateApproved: "N/A",
            DateReceived: "N/A",
            Date: Date.now(),

          });
          const newCreditKey = newbranchRef.key;

          sendModalFun()
          handleCancel()
          sendSuccess()

        }
        catch (error) {
          console.log(error)
          sendModalFun()
          sendFail()
        }

      }

      else {
        console.log("did not select employee ")
        sendModalFun()
        sendFailEmployee()
      }
    }
  };

  const handleCancel = () => {
    setCart([]);
    useUserCartReceipt.setState({ userCartReceipt: [] })
    setTotal(0);
    useUserCartTotalReceipt.setState({ userCartTotalReceipt: 0 })
  };


  /// Update stock
  const updateStockInDatabase = async (id) => {
    try {

      const updates = {};

      cart.forEach((cartItem) => {
        if (cartItem.Stock === "N/A") {
          // Do not subtract for N/A, keep as N/A

          updates[`web/pos/${id}/items/${cartItem.id}/Stock`] = "N/A";

        } else {
          // Normal numbered stock

          updates[`web/pos/${id}/items/${cartItem.id}/Stock`] = cartItem.Stock - cartItem.stock;


        }
      });

      await update(ref(db), updates);
      console.log("Stock updated successfully");
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };



  ////  Auto close modals
  const [sendModalSuccess, setSendModalSuccess] = useState(false);
  const [sendModalFail, setSendModalFail] = useState(false);
  const [sendModalFailEmployee, setSendModalFailEmployee] = useState(false);
  const [sendModalFailTotal, setSendModalFailTotal] = useState(false);

  const sendSuccess = () => {
    setSendModalSuccess(true);
    setTimeout(() => setSendModalSuccess(false), 1500);
  };

  const sendFail = () => {
    setSendModalFail(true);
    setTimeout(() => setSendModalFail(false), 1500);
  };

  const sendFailTotal = () => {
    setSendModalFailTotal(true);
    setTimeout(() => setSendModalFailTotal(false), 1500);
  };

  const sendFailEmployee = () => {
    setSendModalFailEmployee(true);
    setTimeout(() => setSendModalFailEmployee(false), 1500);
  };


  const [ticketModalSuccess, setTicketModalSuccess] = useState(false);
  const [ticketModalFail, setTicketModalFail] = useState(false);
  const [ticketModalFailEmployee, setTicketModalFailEmployee] = useState(false);
  const [ticketModalFailTotal, setTicketModalFailTotal] = useState(false);

  const ticketSuccess = () => {
    setTicketModalSuccess(true);
    setTimeout(() => setTicketModalSuccess(false), 1500);
  };

  const ticketFail = () => {
    setTicketModalFail(true);
    setTimeout(() => setTicketModalFail(false), 1500);
  };

  const ticketfailTotal = () => {
    setTicketModalFailTotal(true);
    setTimeout(() => setTicketModalFailTotal(false), 1500);
  };

  const ticketFailEmployee = () => {
    setTicketModalFailEmployee(true);
    setTimeout(() => setTicketModalFailEmployee(false), 1500);
  };



  const [itemMaxFail, setItemMaxModalFail] = useState(false);
  const [ItemOutStockFail, setItemOutStockModalFail] = useState(false);


  const itemMaxFun = () => {
    setItemMaxModalFail(true);
    setTimeout(() => setItemMaxModalFail(false), 1000);
  };

  const itemOutStockFun = () => {
    setItemOutStockModalFail(true);
    setTimeout(() => setItemOutStockModalFail(false), 1000);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////

  const totalItems = cart.length;
  const totalQty = cart.reduce((sum, item) => sum + parseInt(item.stock), 0);
  const totalWeight = cart.reduce((sum, item) => sum + (parseFloat(item.Weight || 0) * parseInt(item.stock)), 0);

  // VAT Breakdown logic
  const vatBreakdown = {
    A: { vatable: 0, vat: 0 },
    E: { vatable: 0, vat: 0 },
    Z: { vatable: 0, vat: 0 }
  };

  cart.forEach(item => {
    const code = item.vatCode || 'A'; // Default to 'A' if not provided
    const qty = parseInt(item.stock);
    const price = parseFloat(item.Price);
    const vatableAmount = price * qty;
    const vatAmount = code === 'A' ? vatableAmount * 0.16 : 0; // 16% VAT for code A

    if (vatBreakdown[code]) {
      vatBreakdown[code].vatable += vatableAmount;
      vatBreakdown[code].vat += vatAmount;
    }
  });

  const format = (val) => val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const [sortConfig, setSortConfig] = useState({ key: "Name", direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };



  const sortedItems = React.useMemo(() => {
    if (!filteredItems) return [];

    if (!sortConfig.key) return filteredItems;

    return [...filteredItems].sort((a, b) => {
      const { key, direction } = sortConfig;

      if (key === "Name") {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      } else {
        // numeric sorting for Stock or Price
        return direction === "asc"
          ? a[key] - b[key]
          : b[key] - a[key];
      }
    });
  }, [filteredItems, sortConfig]);


  const handleConfirmSell = () => {

    handleSend();        // ✅ proceed
  };



  const [ordersModal, setOrdersModal] = useState(false)

  const ordersModalFun = () => {
    setItemName('')
    setItemPrice('')
    setItemStock('')
    setItemCategory('')

    setOrdersModal(false)

  }


  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filteredTickets, setFilteredTickets] = useState(null);



  const [selectedCashier, setSelectedCashier] = useState("");



  const handleEmployeeClick = (employeeName) => {
    console.log("employeefun", employeeName)

    setSelectedEmployee(employeeName);

    setCart([])

    if (orders) {

      const ticketsForEmployee = orders.filter((t) => t.EmployeeID === employeeName);

      if (ticketsForEmployee.length == 0) {

        setFilteredTickets(null)
      }
      else {

        console.log("employeeb4 set  tickers ", employeeName)
        setFilteredTickets(ticketsForEmployee);
      }

    } else {
      console.log("there are no tickets")
    }

  };


  const handleTicketClick = (cartItems, cashier, cashSale, date) => {
    setCart(cartItems);
    setSelectedCashier(cashier);
    setReceiptNumber(cashSale);

    const jsDate = new Date(date); // Convert timestamp to JS Date

    // Extract date: dd/mm/yyyy
    const day = String(jsDate.getDate()).padStart(2, "0");
    const month = String(jsDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = jsDate.getFullYear();
    const dateOnly = `${day}/${month}/${year}`;

    // Extract time: hh:mm:ss
    const timeOnly = jsDate.toTimeString().split(" ")[0];

    setSelectedDate(dateOnly); // dd/mm/yyyy
    setSelectedTime(timeOnly); // hh:mm:ss
  };

  const [receiveModal, setReceiveModal] = useState(false);

  const receieveModalFun = () => {
    setSelectEmployee("")

    setReceiveModal(false);
  }

  const [receiveModalsuccess, setReceivesuccess] = useState(false);
  const [receiveModalFail, setReceiveFail] = useState(false);


  const receivesuccessFun = () => {
    setReceivesuccess(true);
    setTimeout(() => setReceivesuccess(false), 1500);
  };

  const receiveFailFun = () => {
    setReceiveFail(true);
    setTimeout(() => setReceiveFail(false), 1500);
  };


  const [orderkey, setOrderkey] = useState(false);

  const handleApproveOrder = (orderKey) => {
    if (Id && orderKey) {
      try {
        const orderRef = ref(db, `web/pos/${Id}/orders/${orderKey}`);

        update(orderRef, {
          Received: userAccountName,
          DateReceived: Date.now()
        });

        updateStockInDatabase(Id);

        setReceiveModal(false)
        receivesuccessFun()


      } catch (error) {
        console.log(error);

        setReceiveModal(false)
        receiveFailFun()
      }
    }
  };




  /// Maintain the total function
  const calculateTotal = (cart) => {
    if (!cart || cart.length === 0) {
      return 0;
    }
    return cart.reduce((sum, item) => sum + (item.stock * item.Price), 0);
  };

  useEffect(() => {
    setTotal(calculateTotal(cart));
  }, [cart]);


  useEffect(() => {
    setSelectedCategory("Store");
  }, []);


  return (

    <div className={`min-h-screen flex flex-col"
    ${theme === "Dark"
        ? "text-white "
        : "bg-white-100 text-black rounded-lg"
      }`}
    >

      {/* Main Layout */}

      {!receiptModal && (

        <>
          <div className="flex flex-col md:flex-row flex-grow rounded justify-center 
          ">


            {/* Items */}
            <section className={`w-full md:w-1/2 p-4 rounded-lg  overflow-y-auto h-screen
               ${theme === "Dark"
                ? "text-white   "
                : "bg-gray-200  "
              }`}
            >

              {/* Title + Search */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
                <h3 className="text-sm sm:text-lg font-bold">
                  Items in  Store
                </h3>

                <input
                  type="text"
                  placeholder="Search items..."
                  className={`w-full md:w-auto p-2 rounded-xl text-xs sm:text-sm border outline-none
          ${theme === "Dark"
                      ? "bg-[#1e3a8a] text-white border-blue-700 placeholder-gray-300"
                      : "bg-white text-black border-gray-300 placeholder-gray-500"
                    }`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

              </div>


              <div className="w-full flex flex-col items-center">
                {/* Title */}
                <div className="text-sm font-semibold mb-2 text-center">
                  Select Store
                </div>

                {/* Buttons */}
                {/* Buttons */}
                <div className="flex flex-wrap justify-center items-center gap-2 mb-2">
                  <button
                    className={`font-bold py-1 px-3 rounded-xl text-xs my-1 sm:text-sm
      transition-all duration-200
      ${selectedCategory === "Store"
                        ? "bg-blue-600 text-white shadow-md"
                        : theme === "Dark"
                          ? "bg-gray-700 text-white"
                          : "bg-white text-gray-800 border border-gray-300 shadow-sm hover:shadow-md hover:bg-gray-100"
                      }`}
                    onClick={() => setSelectedCategory("Store")}
                  >
                    Store
                  </button>
                </div>

              </div>

              {filteredItems && (
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 overflow-y-auto">
                  {sortedItems.map((item, index) => {
                    const outOfStock = item.Stock == 0;

                    return (


                      <button
                        key={index}
                        className={`p-3 md:p-5 shadow rounded-lg text-xs md:text-sm
    ${theme === "Dark"
                            ? "text-white bg-[#132962] hover:bg-blue-800"
                            : "bg-green-600 text-white hover:bg-green-400"
                          }
    ${outOfStock ? " cursor-not-allowed" : ""}
  `}
                        onClick={() => !outOfStock && addToCart(item)}

                      >
                        <p>{item.Name}</p>
                        <p>Ksh {item.Price} /=</p>

                        <p className="flex items-center justify-center gap-2 text-white">
                          Stock:

                          {outOfStock ? (
                            <span className="px-2 py-0.5 text-xs bg-red-600 rounded-full">
                              {item.Stock}
                            </span>
                          ) : (
                            <span className="">
                              {item.Stock}
                            </span>
                          )}
                        </p>

                      </button>

                    );
                  })}
                </div>


              )}


              {(!filteredItems || filteredItems.length === 0) && (
                <div className="flex flex-col items-center justify-center py-20 w-full overflow-hidden">

                  {/* Rhythm & Animation Container */}
                  <div className="relative mb-10">
                    {/* Background "Heat/Steam" Pulse */}
                    <div className={`absolute inset-0 scale-150 blur-[60px] opacity-20 animate-[pulse_4s_ease-in-out_infinite] 
        ${theme === "Dark" ? "bg-blue-400" : "bg-blue-600"}`}></div>

                    {/* Main Icon - Floating Rhythm */}
                    <div className="relative z-10 animate-[float_3.5s_ease-in-out_infinite]">
                      <FaBoxOpen className={`text-7xl transition-all duration-500 hover:scale-110 
          ${theme === "Dark" ? "text-white" : "text-blue-700"}`} />

                      {/* The "Fresh" Sparkle */}
                      <div className="absolute -top-2 -right-2 animate-pulse">
                        <div className={`w-3 h-3 rotate-45 ${theme === "Dark" ? "bg-blue-300" : "bg-blue-500"}`}></div>
                      </div>
                    </div>
                  </div>

                  {/* Kitchen-Focused Wording */}
                  <div className="text-center px-4">
                    <h1 className={`text-2xl sm:text-3xl font-black tracking-tight opacity-0 animate-[fadeInSlide_0.8s_ease-out_forwards]
        ${theme === "Dark" ? "text-white" : "text-gray-900"}`}>
                      Your Store is Empty
                    </h1>

                    {/* The Growth Line */}
                    <div className={`h-[3px] w-0 mx-auto my-4 bg-blue-500 animate-[growLine_1s_ease-in-out_0.5s_forwards]`}></div>

                    <p className={`text-md font-medium max-w-xs mx-auto opacity-0 animate-[fadeInSlide_0.8s_ease-out_0.8s_forwards]
        ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
                      Let’s add your first item at the Store
                    </p>
                  </div>

                  {/* Consistent Keyframes */}
                  <style jsx>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      @keyframes fadeInSlide {
        from { opacity: 0; transform: translateY(15px); filter: blur(10px); }
        to { opacity: 1; transform: translateY(0); filter: blur(0); }
      }
      @keyframes growLine {
        from { width: 0; }
        to { width: 80px; }
      }
    `}</style>
                </div>
              )}
            </section>

            {/* Cart */}
            <section
              id="cart-section"
              className={`w-full md:w-1/3 p-4 border-t md:border-t-0 md:border-l rounded-lg
          ${theme === "Dark"
                  ? "text-white   "
                  : "bg-gray-300  "
                }`}
            >


              <div className="flex justify-end">
                <button
                  className={`py-2 px-3 text-xs sm:text-base md:py-2 md:px-4 rounded-lg
      ${theme === "Dark"
                      ? "text-white bg-blue-800 hover:bg-blue-600"
                      : "bg-blue-600 text-white hover:bg-blue-800 shadow-lg"
                    }`}
                  onClick={() => setOrdersModal(true)}
                >
                  Manage Orders
                </button>
              </div>
              <h3 className=" text-sm sm:text-lg font-bold mb-4">Manage Items</h3>
              <div className={`flex justify-between font-bold p-2 rounded mb-2  text-xs sm:text-sm 
            ${theme === "Dark"
                  ? "text-white bg-blue-800  "
                  : "bg-blue-600 shadow text-white "
                }`}
              >
                <div className="w-1/10 text-center">Unit</div>
                <div className="w-2/5 text-center">Name</div>
                <div className="w-1/5 text-center">Price</div>
                <div className="w-1/5 text-center">Actions</div>
              </div>

              <div className="overflow-y-auto max-h-96">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className={` flex justify-between items-center p-2  rounded-md mb-2  text-xs sm:text-sm
                ${theme === "Dark"
                        ? "text-white "
                        : "bg-white shadow-md "
                      }`}
                  >
                    <div className="w-1/10 text-center">{item.stock}</div>
                    <div className="w-2/5 text-center">{item.Name}</div>
                    <div className="w-1/5 text-center">{(parseInt(item.stock) * parseInt(item.Price)).toLocaleString()}</div>
                    <div className="w-3/10 flex justify-between">
                      <button
                        className={` py-0 px-3 text-lg  rounded   
                      ${theme === "Dark"
                            ? "text-white  bg-green-800  hover:bg-green-600   "
                            : "bg-green-600 text-white   hover:bg-green-800"
                          }`}
                        onClick={() => handleIncrease(item)}
                      >
                        +
                      </button>
                      <button
                        className={`  py-0 px-3 text-lg  mx-1 rounded
                         ${theme === "Dark"
                            ? "text-white  bg-blue-800  hover:bg-blue-600   "
                            : "bg-yellow-400 hover:bg-yellow-700 text-black "
                          }`}
                        onClick={() => handleDecrease(item)}
                      >
                        -
                      </button>
                      <button
                        className={` py-0 px-3 rounded 
                       ${theme === "Dark"
                            ? "text-white  bg-red-800  hover:bg-red-600 "
                            : "bg-red-600 text-white  hover:bg-red-800  "
                          }`}

                        onClick={() => handleRemove(item)}
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 font-bold   text-md sm:text-lg">
                Total: Ksh {parseInt(total).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>


              <div className="flex justify-around mt-4">
                <button
                  className={`py-2 px-3  text-xs sm:text-sm md:py-2 md:px-4 md:text-base mt-4 rounded
      ${theme === "Dark"
                      ? "text-white bg-blue-800 hover:bg-blue-600"
                      : "bg-blue-600 text-white hover:bg-blue-800 shadow-lg"
                    }`}
                  onClick={() => setReceiptModal(true)}
                >
                  Receipt
                </button>

                <button
                  className={`py-2 px-3  text-xs sm:text-sm md:py-2 md:px-4 md:text-base mt-4 rounded
      ${theme === "Dark"
                      ? "text-white bg-green-800 hover:bg-green-600"
                      : "bg-green-600 text-white hover:bg-green-800 shadow-lg"
                    }`}
                  onClick={() => setSendModal(true)}
                >
                  Order
                </button>


                <button
                  className={`py-2 px-3  text-xs sm:text-sm md:py-2 md:px-4 md:text-base mt-4 rounded
      ${theme === "Dark"
                      ? "text-white bg-red-800 hover:bg-red-600"
                      : "bg-red-600 text-white hover:bg-red-800 shadow-lg"
                    }`}
                  onClick={() => handleCancel()}
                >
                  Cancel
                </button>
              </div>
            </section>

          </div>


          {/* Mobile Go To Cart Button */}
          <button
            onClick={() =>
              document
                .getElementById("cart-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className={`fixed bottom-1 right-4 z-50 md:hidden
    flex items-center gap-2 px-3 py-3 rounded-full shadow-lg text-sm
    ${theme === "Dark"
                ? "bg-white text-black border-black border-1"
                : "bg-white text-black border-black border-1"}
  `}
          >
            🛒 Cart
            {cart.length > 0 && (
              <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </button>
        </>
      )}


      {/* Modals section */}
      {ordersModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className={`p-6 rounded-xl shadow-lg w-[90%] max-w-7xl h-[90%] overflow-y-auto
        ${theme === "Dark" ? "bg-[#171941] text-white" : "bg-gray-100 text-black"}`}>

            <div className="flex justify-between items-center mb-3 sm:mb-5 sm:mt-2">
              <h2 className="text-sm sm:text-lg font-bold text-center flex-1">
                Manage Orders
              </h2>

              {/* Back / Cancel Button */}
              <button
                className={`ml-4 px-4 py-1 rounded text-sm sm:text-base font-medium transition-colors
      ${theme === "Dark"
                    ? "bg-red-800 hover:bg-red-600 text-white"
                    : "bg-red-600 hover:bg-red-800 text-white"
                  }`}
                onClick={() => (setOrdersModal(false), handleCancel())}
              >
                Back
              </button>

            </div>
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-3">
              {/* Title */}


              <div className={`flex flex-col lg:flex-row flex-grow p-1  md:w-3/4  mx-auto min-w-6xl    ${theme === "Dark"
                ? "text-white "
                : "bg-gray-100 text-black rounded-lg"
                }`}>

                {/* LEFT COLUMN: Orders */}
                <aside className="border-r sm:w-1/2 shadow-2xl rounded-lg h-screen flex flex-col overflow-hidden">

                  <div className="p-6 flex flex-col h-full">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm sm:text-lg font-bold tracking-wide">
                        Orders
                      </h3>

                    </div>

                    {/* Orders List */}
                    <div className="grid grid-cols-1 gap-2 overflow-y-auto pr-2">

                      {orders ? [...orders]
                        .sort((a, b) => b.Date - a.Date)
                        .map((ticket, index) => (

                          <button
                            key={index}
                            onClick={() =>
                              handleTicketClick(
                                ticket.Cart,
                                ticket.EmployeeID,
                                ticket.CashSale,
                                ticket.Date
                              )
                            }

                            className={`p-4 rounded-xl flex flex-col text-left transition-all duration-200 shadow-lg hover:shadow-2xl
            ${theme === "Dark"
                                ? "bg-gray-900 border border-blue-800 hover:bg-blue-900/30"
                                : "bg-white hover:bg-blue-50 border border-gray-200"
                              }`}
                          >

                            {/* Order ID */}
                            <div className="flex justify-between items-center">

                              <p className="font-bold text-sm sm:text-base tracking-wide">
                                Order #{ticket.CashSale}
                              </p>

                              <p className="text-[11px] opacity-60">
                                {new Date(ticket.Date).toLocaleString("en-GB")}
                              </p>

                            </div>

                            {/* Ordered By */}
                            <p className="text-xs opacity-80 mt-1">
                              Order By: {ticket.EmployeeID}
                            </p>

                            {/* Status Section */}
                            <div className="flex gap-3 mt-3 text-[11px]">

                              <span
                                className={`px-2 py-[2px] rounded-full
                ${theme === "Dark"
                                    ? "bg-purple-800 text-purple-200"
                                    : "bg-purple-100 text-purple-700"
                                  }`}
                              >
                                Approved: {ticket.Approved}
                              </span>

                              <span
                                className={`px-2 py-[2px] rounded-full
                ${theme === "Dark"
                                    ? "bg-green-800 text-green-200"
                                    : "bg-green-100 text-green-700"
                                  }`}
                              >
                                Received: {ticket.Received}
                              </span>

                            </div>

                            {/* Actions */}
                            <div className="flex justify-evenly items-center mt-2">

                              {/* Receipt */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();

                                  handleTicketClick(
                                    ticket.Cart,
                                    ticket.EmployeeID,
                                    ticket.CashSale,
                                    ticket.Date
                                  );

                                  setReceiptModal(true);
                                }}
                                className={`px-3 py-1 mx-2 rounded text-xs cursor-pointer shadow-md
                ${theme === "Dark"
                                    ? "bg-blue-800 hover:bg-blue-600 text-white"
                                    : "bg-blue-600 hover:bg-blue-800 text-white"
                                  }`}
                              >
                                Receipt
                              </div>


                              {/* Receive */}

                              {ticket.Approved !== "N/A" && ticket.Received === "N/A" && (
                                <div
                                  className={`px-3 py-1 rounded text-xs font-medium shadow-md
                ${theme === "Dark"
                                      ? "bg-green-700 hover:bg-green-600 text-white"
                                      : "bg-green-600 hover:bg-green-700 text-white"
                                    }`}

                                  onClick={() => {
                                    setOrderkey(ticket.id);
                                    setReceiveModal(true)
                                  }
                                  }
                                >
                                  Receive
                                </div>
                              )}
                            </div>

                          </button>

                        )) : (

                        <div className="text-center opacity-50 mt-6">
                          <FaReceipt className={`text-3xl mx-auto ${theme === "Dark" ? "text-white" : "text-black"}`} />
                          <p className="text-sm mt-2">No Orders</p>
                        </div>

                      )}

                    </div>

                  </div>

                </aside>


                {/* RIGHT COLUMN: Items Section */}
                <section className="w-full sm:w-1/2   p-6 h-screen flex flex-col overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-md sm:text-lg font-bold">Items Breakdown</h3>

                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <table className="min-w-full table-auto shadow-lg rounded overflow-hidden">
                      <thead className={`sticky top-0 ${theme === "Dark" ? "bg-blue-800" : "bg-blue-600 text-white"}`}>
                        <tr>
                          <th className={`border py-2 text-xs sm:text-md ${theme === "Dark" ? "border-blue-900" : "border-gray-300"}`}>#</th>
                          <th className={`border py-2 text-xs sm:text-md ${theme === "Dark" ? "border-blue-900" : "border-gray-300"}`}>Item</th>
                          <th className={`border py-2 text-xs sm:text-md ${theme === "Dark" ? "border-blue-900" : "border-gray-300"}`}>Unit</th>
                          <th className={`border py-2 text-xs sm:text-md ${theme === "Dark" ? "border-blue-900" : "border-gray-300"}`}>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart && cart
                          .filter((item) => item.Name.toLowerCase())
                          .map((item, index) => (
                            <tr key={item.id} className={`text-xs sm:text-sm ${theme === "Dark" ? "hover:bg-blue-900/40" : "bg-white border border-gray-300 hover:bg-blue-100"}`}>
                              <td className={`px-4 py-2 text-center border ${theme === "Dark" ? "border-blue-800" : "border-gray-300"}`}>{index + 1}</td>
                              <td className={`px-4 py-2 text-center border ${theme === "Dark" ? "border-blue-800" : "border-gray-300"}`}>{item.Name}</td>
                              <td className={`px-4 py-2 text-center border ${theme === "Dark" ? "border-blue-800" : "border-gray-300"}`}>{item.stock}</td>
                              <td className={`px-4 py-2 text-center border ${theme === "Dark" ? "border-blue-800" : "border-gray-300"}`}>{item.Price}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </section>



              </div>
            </div>
          </div>
        </div>
      )}

      {receiveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div
            className={`p-6 rounded-xl shadow w-96 mx-4
        ${theme === "Dark" ? "bg-[#171941]" : "bg-white"}
      `}
          >
            <h2 className="text-md sm:text-lg font-bold mb-4 text-center">
              Receive Order
            </h2>

            <div className="mt-4 font-bold text-sm sm:text-lg">
              Received by {userAccountName}
            </div>

            <div className="flex flex-row justify-evenly mt-4">
              <button
                className={`text-white px-4 py-2 rounded text-xs sm:text-base
    ${theme === "Dark"
                    ? "bg-green-800 hover:bg-green-600"
                    : "bg-green-600 hover:bg-green-800"}
  `}

                onClick={() => { setReceiveModal(false), handleApproveOrder(orderkey) }}
              >
                Confirm
              </button>

              <button
                className={`text-white px-4 py-2 rounded text-xs sm:text-base
            ${theme === "Dark"
                    ? "bg-red-800 hover:bg-red-600"
                    : "bg-red-600 hover:bg-red-800"}
          `}
                onClick={receieveModalFun}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      {/* receipt details Modal */}
      {receiptDetailsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div
            className={`p-6 rounded-xl shadow w-96 ${theme === "Dark" ? "bg-[#171941]" : "bg-white"
              }`}
          >
            <h2 className="text-lg font-bold mb-4 text-center">
              Enter Receipt details
            </h2>

            <div className="mt-4 font-bold text-lg">
              Total: Ksh {total.toFixed(2)}
            </div>

            <div className="mt-4">
              <div className="mt-4  font-bold text-lg">
                Sold by {userAccountName}
              </div>

            </div>

            <div className="flex flex-row justify-evenly">
              <button
                className={`text-white px-4 py-2 rounded mt-4 ${theme === "Dark"
                  ? "bg-green-800 hover:bg-green-600"
                  : "bg-green-600 hover:bg-green-800"
                  }`}
                onClick={receiptDetailsClose}
              >
                View Receipt
              </button>
              <button
                className={`text-white px-4 py-2 rounded mt-4 ${theme === "Dark"
                  ? "bg-red-800 hover:bg-red-600"
                  : "bg-red-600 hover:bg-red-800"
                  }`}
                onClick={receiptDetailsModalFun}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      {receiptModal && (
        <div className="w-full flex items-center justify-center bg-black bg-opacity-90 overflow-y-auto z-50">

          <div
            className={`p-4  shadow w-[380px] font-sans text-sm  print-area receipt-container
        ${theme === "Dark" ? "bg-white text-black" : "bg-white text-black"}
      `}
          >
            <div className="text-center text-2xl font-bold">
              <p className="text-xl font-extrabold tracking-tight uppercase font-sans">
                {bizName}
              </p>
              <p className="font-semibold text-xs">Email : {bizEmail}</p>
              <p className="font-semibold text-xs">TEL :{bizPhone}</p>
              {/**
               *  <p className="font-semibold text-xs">VAT #: A002691181T | PIN  #: A002691181T</p>
               */}

            </div>

            {/* Paybill Section with background 
             <div className="print-bg bg-black text-white text-4xl py-1 text-center font-bold">
              PAYBILL: 157424
            </div>
            */}


            <div className="border-t border-dotted border-black/20 mt-1"></div>

            {/* Cash Sale Header */}

            <div className="text-center font-bold text-lg mb-2">CASH SALE</div>
            <div className="border-t border-dotted border-black/20"></div>
            <div className="flex justify-between mb-2 font-bold">
              <div>
                {/**<p className="text-sm  ">Till No: {selectedTill}</p> */}
                <p className="text-sm ">M/S: {userAccountName}</p>
                <p className="text-sm ">PIN:</p>
              </div>
              <div>
                <p className="text-sm">Cash Sale #: {receiptNumber}</p>
              </div>

            </div>
            <div className="border-t border-dotted border-black/20"></div>

            <div className="flex justify-between mb-1">
              <p className="text-sm">Date: {selectedDate}</p>
              <p className="text-sm ">Time:<span className="text-xs mx-3"> {selectedTime}</span></p>
            </div>
            <div className="border-t border-dotted border-black/20"></div>
            <div >
              <div className="flex justify-between font-bold text-sm">
                <div className="w-1/2">ITEM</div>
                <div className="grid grid-cols-2 gap-4 w-40 text-right">
                  <span>PRICE</span>
                  <span>AMOUNT</span>
                </div>
              </div>
              <div className="border-t border-dotted border-black/20"></div>

              <div className="bg-white text-black">
                {cart.map((item, i) => (
                  <div key={i} className="py-1">
                    <div className="flex justify-between font-bold">
                      <div className="font-sm">{item.Name}</div>
                      <div className="text-xs">A</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-xs" >

                        <span className="ml-8 text-sm ">
                          Qty : {parseFloat(item.stock).toFixed(0)}
                        </span>
                      </div>
                      <div >
                        <div className="grid grid-cols-2 gap-4 w-40 text-right">

                          <span>{item.Price.toLocaleString()}</span>
                          <span>{(parseInt(item.stock) * parseInt(item.Price)).toLocaleString()}</span>

                        </div>
                      </div>
                    </div>
                    <div className="border-t border-dotted border-black/20"></div>
                  </div>

                ))}
              </div>


              <div className="border-t border-dotted border-black/20"></div>
              <div className=" my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL:</span>
                <span>{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-dotted border-black/20"></div>
              <div className="flex justify-between font-bold text-lg">
                <span>CASH:</span>
                <span>{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-dotted border-black/20"></div>
              <div className="flex justify-between font-bold text-lg">
                <span>CHANGE:</span>
                <span>0.00</span>
              </div>
            </div>
            <div className="border-t border-dotted border-black/20"></div>

            {/* Footer Summary */}
            <div className="text-xs space-y-1">
              <p className="flex items-center font-bold">
                <strong className="flex-1">TOTAL ITEMS:</strong>
                <span className="text-center w-40 mr-7">{totalItems}</span>
              </p>
              <div className="border-t border-dotted border-black/20"></div>
              <p className="flex items-center font-bold">
                <strong className="flex-1">TOTAL QTY:</strong>
                <span className="text-center w-40 mr-7">{totalQty}</span>
              </p>
              <div className="border-t border-dotted border-black/20"></div>
              <div className="border-t border-dotted border-black/20"></div>

              {/* VAT Breakdown */}
              <div className="mt-2">
                <div className="grid grid-cols-4 text-xs mr-6">
                  <p className="col-span-1 underline text-left"><strong>CODE</strong></p>
                  <p className="col-span-1 underline text-right"><strong>VATABLE AMT</strong></p>
                  <p className="col-span-1 underline text-right"><strong>VAT AMT</strong></p>
                  <p className="col-span-1 underline text-right"><strong>TOTAL</strong></p>

                  {['A', 'E', 'Z'].map(code => (
                    <React.Fragment key={code}>
                      <p className="col-span-1 text-left font-bold">{code}</p>
                      <p className="col-span-1 text-right font-bold">{format(vatBreakdown[code].vatable - vatBreakdown[code].vat)}</p>
                      <p className="col-span-1 text-right font-bold">{format(vatBreakdown[code].vat)}</p>
                      <p className="col-span-1 text-right font-bold">
                        {format(vatBreakdown[code].vatable)}
                      </p>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="border-t border-dotted border-black/20"></div>
              <p className="mt-2 font-semibold">VAT CODE:(A)=VATABLE, (E)=EXEMPT, (Z)=ZERO RATED</p>
              <p className="font-semibold">PRICES INCLUSIVE OF VAT WHERE APPLICABLE</p>
              <div className="border-t border-dotted border-black/20"></div>
              <div className="border-t border-dotted border-black/20"></div>
              <p className="font-bold">YOU WERE SERVED BY : {userAccountName}</p>
              <div className="border-t border-dotted border-black/20"></div>
              <div className="border-t border-dotted border-black/20"></div>
              <div className="text-xm text-center font-bold">
                <p>GOODS ONCE SOLD CANNOT BE ACCEPTED</p>
                <p>BACK FOR REFUND OR ANY OTHER REASON</p>
              </div>
              <div className="border-t border-dotted border-black/20"></div>
              <div className="border-t border-dotted border-black/20"></div>
              <div className="border-t border-dotted border-black/20"></div>

              {/* QR Code Placeholder */}
              <div className="flex justify-center my-3">
                <QRCodeSVG
                  value={JSON.stringify({
                    invoice: '011039102000356913',
                    totalItems: totalItems,
                    totalQty: totalQty,
                    totalWeight: totalWeight.toFixed(2),
                    totalVAT: vatBreakdown.A.vat.toFixed(2),
                    totalAmount: (vatBreakdown.A.vatable + vatBreakdown.A.vat).toFixed(2),
                  })}
                  size={96}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                  className="border border-gray-400"
                />
              </div>
              <div className="border-t border-black mb-2"></div>

            </div>
            <div className="text-xs text-center font-semibold">
              <p >Thank You......Come Again.</p>
            </div>
            <div className=" no-print flex flex-row justify-evenly mt-4">
              <button
                className={`text-white px-4 py-2 rounded 
            ${theme === "Dark" ? "bg-green-800 hover:bg-green-600" : "bg-green-600 hover:bg-green-800"}`}
                onClick={() => window.print()}
              >
                Print
              </button>
              <button
                className={`text-white px-4 py-2 rounded 
            ${theme === "Dark" ? "bg-red-800 hover:bg-red-600" : "bg-red-600 hover:bg-red-800"}`}
                onClick={receiptModalFun}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* send Modal */}

      {sendModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div
            className={`p-6 rounded-xl shadow w-96 mx-4
        ${theme === "Dark" ? "bg-[#171941]" : "bg-white"}
      `}
          >
            <h2 className="text-md sm:text-lg font-bold mb-4 text-center">
              Confirm Order
            </h2>


            <div className="mt-4 font-bold text-sm sm:text-lg">
              Ordered by {userAccountName}
            </div>

            {/* 🔹 PAYMENT METHOD (HANDLED LIKE CATEGORY) */}


            <div className="flex flex-row justify-evenly mt-4">

              {/* 🔒 MPESA BUTTON (DO NOT REMOVE — COMMENTED) */}
              {/*
        <button
          className={`py-2 px-4 rounded text-xs sm:text-base
            ${theme === "Dark"
              ? "text-white bg-green-800 hover:bg-green-600"
              : "bg-green-600 text-white hover:bg-green-800 shadow-lg"}
          `}
          onClick={() => setSendMpesa(true)}
        >
          Mpesa
        </button>
        
        */}

              {/* ✅ SELL */}




              <button
                className={`text-white px-4 py-2 rounded text-xs sm:text-base
    ${theme === "Dark"
                    ? "bg-green-800 hover:bg-green-600"
                    : "bg-green-600 hover:bg-green-800"}
  `}
                onClick={handleConfirmSell}
              >
                Order
              </button>


              {/* ❌ CANCEL */}
              <button
                className={`text-white px-4 py-2 rounded text-xs sm:text-base
            ${theme === "Dark"
                    ? "bg-red-800 hover:bg-red-600"
                    : "bg-red-600 hover:bg-red-800"}
          `}
                onClick={sendModalFun}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Auto-Close Modals */}
      {sendModalSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className={` p-6 rounded-xl 
                    
                     ${theme === "Dark"
              ? " bg-[#171941] "
              : " bg-white shadow-lg "
            }`}>
            <div className='flex justify-center'>

              <TiTick className='text-green-600 text-4xl  ' />
              <h2 className="text-lg font-bold mb-4">Success</h2>
            </div>
            <p>The Items were Orders Successfully</p>
          </div>
        </div>
      )}

      {sendModalFail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className={` p-6 rounded-xl 
                    
                     ${theme === "Dark"
              ? " bg-[#171941] "
              : " bg-white shadow-lg "
            }`}>
            <div className='flex justify-center'>
              <TbXboxX className='text-red-600 text-3xl   ' />
              <h2 className="text-lg font-bold mb-4 mx-1">Failed</h2>
            </div>
            <p>The items were NOT Orders</p>
          </div>
        </div>
      )}

      {sendModalFailTotal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className={` p-6 rounded-xl 
                    
                     ${theme === "Dark"
              ? " bg-[#171941] "
              : " bg-white shadow-lg "
            }`}>
            <div className='flex justify-center'>
              <TbXboxX className='text-red-600 text-3xl   ' />
              <h2 className="text-lg font-bold mb-4 mx-1">Failed</h2>
            </div>
            <p>The Manege Items Menu is Empty</p>
          </div>
        </div>
      )}


      {sendModalFailEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className={` p-6 rounded-xl 
                    
                     ${theme === "Dark"
              ? " bg-[#171941] "
              : " bg-white shadow-lg "
            }`}>
            <div className='flex justify-center'>
              <TbXboxX className='text-red-600 text-3xl   ' />
              <h2 className="text-lg font-bold mb-4 mx-1">Failed</h2>
            </div>
            <p>The cart cannot be empty</p>
          </div>
        </div>
      )}

      {/* Auto-Close Modals */}



      {receiveModalsuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className={` p-6 rounded-xl 
                    
                     ${theme === "Dark"
              ? " bg-[#171941] "
              : " bg-white shadow-lg "
            }`}>
            <div className='flex justify-center'>

              <TiTick className='text-green-600 text-4xl  ' />
              <h2 className="text-lg font-bold mb-4">Success</h2>
            </div>
            <p>The Order was Received</p>
          </div>
        </div>
      )}

      {receiveModalFail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className={` p-6 rounded-xl 
                    
                     ${theme === "Dark"
              ? " bg-[#171941] "
              : " bg-white shadow-lg "
            }`}>
            <div className='flex justify-center'>
              <TbXboxX className='text-red-600 text-3xl   ' />
              <h2 className="text-lg font-bold mb-4 mx-1">Failed</h2>
            </div>
            <p>The Order was NOT received</p>
          </div>
        </div>
      )}


      {ticketModalSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className={` p-6 rounded-xl 
                    
                     ${theme === "Dark"
              ? " bg-[#171941] "
              : " bg-white shadow-lg "
            }`}>
            <div className='flex justify-center'>

              <TiTick className='text-green-600 text-4xl  ' />
              <h2 className="text-lg font-bold mb-4">Success</h2>
            </div>
            <p>The Items were Consumed Successfully</p>
          </div>
        </div>
      )}

      {ticketModalFail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className={` p-6 rounded-xl 
                    
                     ${theme === "Dark"
              ? " bg-[#171941] "
              : " bg-white shadow-lg "
            }`}>
            <div className='flex justify-center'>
              <TbXboxX className='text-red-600 text-3xl   ' />
              <h2 className="text-lg font-bold mb-4 mx-1">Failed</h2>
            </div>
            <p>The items was NOT consumed </p>
          </div>
        </div>
      )}

      {ticketModalFailTotal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className={` p-6 rounded-xl 
                    
                     ${theme === "Dark"
              ? " bg-[#171941] "
              : " bg-white shadow-lg "
            }`}>
            <div className='flex justify-center'>
              <TbXboxX className='text-red-600 text-3xl   ' />
              <h2 className="text-lg font-bold mb-4 mx-1">Failed</h2>
            </div>
            <p>The Manege Items Menu is Empty</p>
          </div>
        </div>
      )}

      {ticketModalFailEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className={` p-6 rounded-xl 
                    
                     ${theme === "Dark"
              ? " bg-[#171941] "
              : " bg-white shadow-lg "
            }`}>
            <div className='flex justify-center'>
              <TbXboxX className='text-red-600 text-3xl   ' />
              <h2 className="text-lg font-bold mb-4 mx-1">Failed</h2>
            </div>
            <p>Fill all fields</p>
          </div>
        </div>
      )}

      {itemMaxFail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className={` p-6 rounded-xl 
                    
                     ${theme === "Dark"
              ? " bg-[#171941] "
              : " bg-white shadow-lg "
            }`}>
            <div className='flex justify-center'>
              <TbXboxX className='text-red-600 text-3xl   ' />
              <h2 className="text-lg font-bold mb-4 mx-1">Failed</h2>
            </div>
            <p>The Maximum Stock of Item </p>
          </div>
        </div>
      )}

      {ItemOutStockFail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className={` p-6 rounded-xl 
                    
                     ${theme === "Dark"
              ? " bg-[#171941] "
              : " bg-white shadow-lg "
            }`}>
            <div className='flex justify-center'>
              <TbXboxX className='text-red-600 text-3xl   ' />
              <h2 className="text-lg font-bold mb-4 mx-1">Failed</h2>
            </div>
            <p>Item is Out of Stock </p>
          </div>
        </div>
      )}

    </div>

  )
}

export default Orders