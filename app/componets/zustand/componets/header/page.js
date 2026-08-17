'use client'

import { FaUser, FaTerminal, FaClock, FaMoneyBillWave, FaReceipt, FaFileInvoiceDollar, FaExclamationCircle } from "react-icons/fa";
import { ref, onValue } from "firebase/database";
import { db } from "../../../../../config";
import React, { useState, useEffect, useCallback } from 'react';
import { useUserItems, useUserItemsData, useUserItemsTotal } from "@/app/componets/zustand/items";
import { useUserEmployee, useUserEmployeeTotal } from "@/app/componets/zustand/employees";
import { useUserCategories, useUserCategoriesTotal } from "@/app/componets/zustand/categories";
import { useUserSupplier, useUserSupplierTotal } from "@/app/componets/zustand/supplier";
import { useUserSupplyItems, useUserSupplyItemsData, useUserSupplyItemsTotal } from "@/app/componets/zustand/supplyItems";
import { useUserCart, useUserCartData, useUserCartTotal } from "@/app/componets/zustand/cart";
import { useUserTicket, useUserTicketData, useUserTicketTotal } from "@/app/componets/zustand/ticket";

import { useUserID, useUserName, useUserRole } from "@/app/componets/zustand/profile";
import { useUserLogs, useUserLogsData, useUserLogsTotal } from "@/app/componets/zustand/logs";
import Dashboard from "@/app/allpages/dashboard/page";
import Inventory from "@/app/allpages/inventory/page";
import Ticket from "@/app/allpages/ticket/page";
import Reports from "@/app/allpages/report/page";
import Suppliers from "@/app/allpages/supply/page";
import Settings from "@/app/allpages/settings/page";
import { FaTachometerAlt, FaBoxOpen, FaTicketAlt, FaChartLine, FaTruck, FaCog } from 'react-icons/fa';
import { useUserTheme } from "../zustand/theme";
import {
    FaHome, FaInfoCircle, FaMapMarkedAlt, FaPhotoVideo, FaChalkboardTeacher,
    FaHandsHelping, FaUserInjured, FaBriefcase, FaFileContract, FaQuestionCircle, FaEnvelope, FaFirstAid, FaChevronDown, FaBars, FaSearch, FaUtensils,
    FaBed,
    FaCookieBite,
    FaHandHoldingUsd,
} from 'react-icons/fa';
import Debt from "@/app/allpages/debt/page";
import Profile from "@/app/allpages/profile/page";

import Expenses from "@/app/allpages/expenses/page";


import { useUserOrders, useUserOrdersData, useUserOrdersTotal } from "@/app/componets/zustand/orders";

import { useUserExpenses, useUserExpensesData, useUserExpensesTotal } from "../zustand/expenses";
import { useUserExpensesCategories, useUserExpensesCategoriesData, useUserExpensesCategoriesTotal } from "../zustand/expenseCategories";



const pages = [
    { name: 'Bar & Restaurant', icon: <FaUtensils /> },
    { name: 'Accommodation', icon: <FaBed /> },
    { name: 'Kitchen', icon: <FaCookieBite /> },
    { name: 'Store', icon: <FaBoxOpen /> },
    { name: 'Receipts', icon: <FaReceipt /> },
    { name: 'Debt', icon: <FaHandHoldingUsd /> },
    { name: 'Expenses', icon: <FaMoneyBillWave /> },
    { name: 'Reports', icon: <FaChartLine /> },
    { name: 'Suppliers', icon: <FaTruck /> },
    { name: 'Settings', icon: <FaCog /> },
    { name: 'Profile', icon: <FaUser /> },
];

const Header = () => {


    const [isScrolled, setIsScrolled] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);
    const [branchesOpen, setBranchesOpen] = useState(false);
    const [dropdownTimeout, setDropdownTimeout] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);


    //// General Variables

    const Id = useUserID((state) => state.userID)
    const theme = useUserTheme((state) => state.userTheme)
    const bizName = useUserName((state) => state.userName)
    const roleUser = useUserRole((state) => state.userRole)


    const rolePages = {
        Admin: [
            "Bar & Restaurant", "Accommodation", "Kitchen", "Store",
            "Receipts", "Debt", "Expenses", "Reports",
            "Suppliers", "Settings",
        ],
        Manager: [
            "Accommodation", "Store", "Receipts", "Debt", "Expenses", "Reports", "Suppliers", "Profile"
        ],
        Cashier: [
            "Bar & Restaurant", "Receipts", "Debt", "Profile"
        ],
        Kitchen: [
            "Kitchen", "Profile"
        ],
        Accommodation: [
            "Accommodation", "Receipts", "Profile"
        ],
        Store: [
            "Store", "Suppliers", "Profile"
        ]
    };

    const allowedPages = pages.filter((p) =>
        roleUser && rolePages[roleUser]
            ? rolePages[roleUser].includes(p.name)
            : false
    );

    const [currentPage, setCurrentPage] = useState(
        allowedPages.length > 0 ? allowedPages[0].name : null
    );
    useEffect(() => {
        if (allowedPages.length > 0) {
            setCurrentPage(allowedPages[0].name);
        }
    }, [roleUser]);
    useEffect(() => {
        const userPermissions = rolePages[roleUser];
        if (userPermissions && !userPermissions.includes(currentPage)) {
            const fallback = userPermissions[0];
            setCurrentPage(fallback);
        }
    }, [roleUser, currentPage]);

    const renderPage = () => {
        switch (currentPage) {
            case 'Bar & Restaurant': return <Dashboard />;
            case 'Kitchen': return <Kitchen />;
            case 'Accommodation': return <Accommodation />;
            case 'Expenses': return <Expenses />;
            case 'Store': return <Inventory />;
            case 'Receipts': return <Ticket />;
            case 'Debt': return <Debt />;
            case 'Reports': return <Reports />;
            case 'Suppliers': return <Suppliers />;
            case 'Settings': return <Settings />;
            case 'Profile': return <Profile />;
            default: return null;
        }
    };
    ///// Fetch firebase 
    const fetchEmployee = useCallback(() => {
        if (Id) {
            try {

                const posRef = ref(db, `web/pos/${Id}/employees`);
                onValue(posRef, (snapshot) => {

                    const data = snapshot.val();

                    if (data) {

                        const newPosts = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));

                        const total = Object.keys(data).map(key => ({
                            id: key,
                        }));

                        useUserEmployee.setState({ userEmployee: newPosts })
                        useUserEmployeeTotal.setState({ userEmployeeTotal: total.length })
                    }
                });
            } catch {

                useUserEmployee.setState({ userEmployee: null })
                useUserEmployeeTotal.setState({ userEmployeeTotal: null })

                console.log("cannot read employees")
            }
        }
    }, [Id]);

    useEffect(() => {
        fetchEmployee();
    }, [fetchEmployee]);


    const fetchItems = useCallback(() => {

        if (Id) {
            try {
                const posRef = ref(db, `web/pos/${Id}/items`);
                onValue(posRef, (snapshot) => {

                    const data = snapshot.val();

                    if (data) {

                        const newPosts = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));

                        const total = Object.keys(data).map(key => ({
                            id: key,
                        }));

                        useUserItems.setState({ userItems: newPosts })
                        useUserItemsTotal.setState({ userItemsTotal: total.length })
                        useUserItemsData.setState({ userItemsData: data })

                    }
                });

            } catch {

                useUserItems.setState({ userItems: null })
                useUserItemsTotal.setState({ userItemsTotal: null })
                useUserItemsData.setState({ userItemsData: null })
                console.log("cannot read items")

            }
        }


    }, [Id]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);


    const fetchCategories = useCallback(() => {

        console.log("id cat", Id)

        if (Id) {
            try {

                const posRef = ref(db, `web/pos/${Id}/categories`);
                onValue(posRef, (snapshot) => {

                    const data = snapshot.val();

                    if (data) {

                        const newPosts = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));


                        const total = Object.keys(data).map(key => ({
                            id: key,
                        }));

                        useUserCategories.setState({ userCategories: newPosts })
                        useUserCategoriesTotal.setState({ userCategoriesTotal: total.length })

                    }
                });

            } catch {

                useUserCategories.setState({ userCategories: null })
                useUserCategoriesTotal.setState({ userCategoriesTotal: null })

                console.log("cannot read categories")

            }
        }

    }, [Id]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);



    const fetchRoom = useCallback(() => {

        if (Id) {
            try {
                const posRef = ref(db, `web/pos/${Id}/room`);
                onValue(posRef, (snapshot) => {

                    const data = snapshot.val();

                    if (data) {

                        const newPosts = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));

                        const total = Object.keys(data).map(key => ({
                            id: key,
                        }));

                        useUserRoom.setState({ userRoom: newPosts })
                        useUserRoomTotal.setState({ userRoomTotal: total.length })
                        useUserRoomData.setState({ userRoomData: data })

                    }
                });

            } catch {

                useUserRoom.setState({ userRoom: null })
                useUserRoomTotal.setState({ userRoomTotal: null })
                useUserRoomData.setState({ userRoomData: null })
                console.log("cannot read rooms")

            }
        }

    }, [Id]);

    useEffect(() => {
        fetchRoom();
    }, [fetchRoom]);


    const fetchRoomCategories = useCallback(() => {

        console.log("id cat", Id)

        if (Id) {
            try {

                const posRef = ref(db, `web/pos/${Id}/roomcategories`);
                onValue(posRef, (snapshot) => {

                    const data = snapshot.val();

                    if (data) {

                        const newPosts = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));


                        const total = Object.keys(data).map(key => ({
                            id: key,
                        }));

                        useUserRoomCategories.setState({ userRoomCategories: newPosts })
                        useUserRoomCategoriesTotal.setState({ userRoomCategoriesTotal: total.length })

                    }
                });

            } catch {

                useUserRoomCategories.setState({ userRoomCategories: null })
                useUserRoomCategoriesTotal.setState({ userRoomCategoriesTotal: null })

                console.log("cannot read room categories")

            }
        }

    }, [Id]);

    useEffect(() => {
        fetchRoomCategories();
    }, [fetchRoomCategories]);


    const fetchCheckout = useCallback(() => {

        if (Id) {
            try {
                const posRef = ref(db, `web/pos/${Id}/checkoutlist`);
                onValue(posRef, (snapshot) => {

                    const data = snapshot.val();

                    if (data) {

                        const newPosts = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));

                        const total = Object.keys(data).map(key => ({
                            id: key,
                        }));

                        useUserCheckoutList.setState({ userCheckoutList: newPosts })
                        useUserCheckoutListData.setState({ userCheckoutListData: data })
                        useUserCheckoutListTotal.setState({ userCheckoutListTotal: total.length })

                    }
                });

            } catch {

                useUserCheckoutList.setState({ userCheckoutList: null })
                useUserCheckoutListData.setState({ userCheckoutListData: null })
                useUserCheckoutListTotal.setState({ userCheckoutLisTotal: null })
                console.log("cannot read CheckoutLis")

            }
        }

    }, [Id]);

    useEffect(() => {
        fetchCheckout();
    }, [fetchCheckout]);



    const fetchReserved = useCallback(() => {

        if (Id) {
            try {

                const posRef = ref(db, `web/pos/${Id}/reserved`);
                onValue(posRef, (snapshot) => {

                    const data = snapshot.val();

                    if (data) {

                        const newPosts = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));

                        const total = Object.keys(data).map(key => ({
                            id: key,
                        }));


                        useUserReserved.setState({ userReserved: newPosts })
                        useUserReservedData.setState({ userReservedData: data })
                        useUserReservedTotal.setState({ userReservedTotal: total.length })

                    }
                });

            } catch {

                useUserReserved.setState({ userReserved: null })
                useUserReservedData.setState({ userReservedData: null })
                useUserReservedTotal.setState({ userReservedTotal: null })
                console.log("cannot read  reserved")

            }

        }


    }, [Id]);

    useEffect(() => {
        fetchReserved();
    }, [fetchReserved]);


    const fetchOrders = useCallback(() => {

        if (Id) {
            try {

                const posRef = ref(db, `web/pos/${Id}/orders`);
                onValue(posRef, (snapshot) => {

                    const data = snapshot.val();

                    if (data) {

                        const newPosts = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));

                        const total = Object.keys(data).map(key => ({
                            id: key,
                        }));

                        useUserOrders.setState({ userOrders: newPosts })
                        useUserOrdersData.setState({ userOrdersData: data })
                        useUserOrdersTotal.setState({ userOrdersTotal: total.length })

                    }
                });

            } catch {

                useUserOrders.setState({ userOrders: null })
                useUserOrdersData.setState({ userOrdersData: null })
                useUserOrdersTotal.setState({ userOrdersTotal: null })
                console.log("cannot read cart")

            }

        }
    }, [Id]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);




    const fetchExpenses = useCallback(() => {

        if (Id) {
            try {

                const posRef = ref(db, `web/pos/${Id}/expenses`);
                onValue(posRef, (snapshot) => {

                    const data = snapshot.val();

                    if (data) {

                        const newPosts = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));

                        const total = Object.keys(data).map(key => ({
                            id: key,
                        }));

                        useUserExpenses.setState({ userExpenses: newPosts })
                        useUserExpensesData.setState({ userExpensesData: data })
                        useUserExpensesTotal.setState({ userExpensesTotal: total.length })

                    }
                });

            } catch {

                useUserExpenses.setState({ userExpensesrExpenses: null })
                useUserExpensesData.setState({ userExpensesData: null })
                useUserExpensesTotal.setState({ userExpensesTotal: null })
                console.log("cannot read Expenses")

            }

        }


    }, [Id]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);




    const fetchExpensesCategories = useCallback(() => {

        if (Id) {
            try {

                const posRef = ref(db, `web/pos/${Id}/expensecategories`);
                onValue(posRef, (snapshot) => {

                    const data = snapshot.val();

                    if (data) {

                        const newPosts = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));

                        const total = Object.keys(data).map(key => ({
                            id: key,
                        }));

                        useUserExpensesCategories.setState({ userExpensesCategories: newPosts })
                        useUserExpensesCategoriesData.setState({ userExpensesCategoriesData: data })
                        useUserExpensesCategoriesTotal.setState({ userExpensesCategoriesTotal: total.length })

                    }
                });

            } catch {

                useUserExpensesCategories.setState({ userExpensesCategories: null })
                useUserExpensesCategoriesData.setState({ userExpensesCategoriesData: null })
                useUserExpensesCategoriesTotal.setState({ userExpensesCategoriesTotal: null })

                
                console.log("cannot read Expenses")

            }

        }


    }, [Id]);

    useEffect(() => {
        fetchExpensesCategories();
    }, [fetchExpensesCategories]);



    const fetchSuppliers = useCallback(() => {
        if (Id) {
            try {

                const posRef = ref(db, `web/pos/${Id}/suppliers`);
                onValue(posRef, (snapshot) => {

                    const data = snapshot.val();

                    if (data) {

                        const newPosts = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));


                        const total = Object.keys(data).map(key => ({
                            id: key,
                        }));

                        useUserSupplier.setState({ userSupplier: newPosts })
                        useUserSupplierTotal.setState({ userSupplierTotal: total.length })

                    }
                });

            } catch {
                useUserSupplier.setState({ userSupplier: null })
                useUserSupplierTotal.setState({ userSupplierTotal: null })

                console.log("cannot read suppliers")
            }

        }

    }, [Id]);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);


    const fetchSupplierItems = useCallback(() => {

        if (Id) {
            try {

                const posRef = ref(db, `web/pos/${Id}/supplierItems`);
                onValue(posRef, (snapshot) => {

                    const data = snapshot.val();

                    if (data) {

                        const newPosts = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));

                        const total = Object.keys(data).map(key => ({
                            id: key,
                        }));

                        useUserSupplyItems.setState({ userSupplyItems: newPosts })
                        useUserSupplyItemsTotal.setState({ userSupplyItemsTotal: total.length })
                        useUserSupplyItemsData.setState({ userSupplyItemsData: data })

                    }
                });

            } catch {

                useUserSupplyItems.setState({ userSupplyItems: null })
                useUserSupplyItemsTotal.setState({ userSupplyItemsTotal: null })
                useUserSupplyItemsData.setState({ userSupplyItemsData: null })

                console.log("cannot read supplier items")

            }

        }


    }, [Id]);

    useEffect(() => {
        fetchSupplierItems();
    }, [fetchSupplierItems]);


    const fetchCart = useCallback(() => {

        if (Id) {
            try {

                const posRef = ref(db, `web/pos/${Id}/cart`);
                onValue(posRef, (snapshot) => {

                    const data = snapshot.val();

                    if (data) {

                        const newPosts = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));

                        const total = Object.keys(data).map(key => ({
                            id: key,
                        }));

                        useUserCart.setState({ userCart: newPosts })
                        useUserCartData.setState({ userCartData: data })
                        useUserCartTotal.setState({ userCartTotal: total.length })

                    }
                });

            } catch {

                useUserCart.setState({ userCart: null })
                useUserCartData.setState({ userCartData: null })
                useUserCartTotal.setState({ userCartTotal: null })
                console.log("cannot read cart")

            }

        }


    }, [Id]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);


    const fetchLogs = useCallback(() => {
        if (Id) {
            try {
                const posRef = ref(db, `web/pos/${Id}/edit`);
                onValue(posRef, (snapshot) => {

                    const data = snapshot.val();

                    if (data) {

                        const newPosts = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));

                        const total = Object.keys(data).map(key => ({
                            id: key,
                        }));

                        useUserLogs.setState({ userLogs: newPosts })
                        useUserLogsData.setState({ userLogsData: data })
                        useUserLogsTotal.setState({ userLogsTotal: total.length })
                    }
                });
            } catch {
                useUserLogs.setState({ userLogs: null })
                useUserLogsData.setState({ userLogsData: null })
                useUserLogsTotal.setState({ userLogsTotal: null })
                console.log("cannot read logs")
            }
        }
    }, [Id]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);


    const fetchTickets = useCallback(() => {
        if (Id) {
            try {
                const posRef = ref(db, `web/pos/${Id}/ticket`);
                onValue(posRef, (snapshot) => {

                    const data = snapshot.val();

                    if (data) {

                        const newPosts = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));

                        const total = Object.keys(data).map(key => ({
                            id: key,
                        }));

                        useUserTicket.setState({ userTicket: newPosts })
                        useUserTicketData.setState({ userTicketData: data })
                        useUserTicketTotal.setState({ userTicketTotal: total.length })

                    }
                });

            } catch {

                useUserTicket.setState({ userTicket: null })
                useUserTicketData.setState({ userTicketData: null })
                useUserTicketTotal.setState({ userTicketTotal: null })
                console.log("cannot read tickets")

            }
        }
    }, [Id]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);



    const fetchConsumed = useCallback(() => {

        if (Id) {
            try {

                const posRef = ref(db, `web/pos/${Id}/consumed`);
                onValue(posRef, (snapshot) => {

                    const data = snapshot.val();

                    if (data) {

                        const newPosts = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));

                        const total = Object.keys(data).map(key => ({
                            id: key,
                        }));

                        useUserConsumed.setState({ userConsumed: newPosts })
                        useUserConsumedData.setState({ userConsumedData: data })
                        useUserConsumedTotal.setState({ userConsumedTotal: total.length })

                    }
                });

            } catch {

                useUserConsumed.setState({ userConsumed: null })
                useUserConsumedData.setState({ userConsumedData: null })
                useUserConsumedTotal.setState({ userConsumedTotal: null })
                console.log("cannot read cart")

            }

        }
    }, [Id]);

    useEffect(() => {
        fetchConsumed();
    }, [fetchConsumed]);




    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);





    return (

        <div>
            {/* Header */}
            <div className={` hidden md:flex   items-center justify-between p-3 
            
             ${theme === "Dark"
                    ? "bg-[#132962] text-white"
                    : " text-black bg-gray-200  "
                }`
            }>
                {/* Logo */}
                <div className={`flex items-center text-xl font-bold  
                  ${theme === "Dark"
                        ? " text-white"
                        : " text-blue-600 "
                    }`
                }>
                    <img
                        src="/logo.png"
                        alt="Business Logo"
                        className="w-12 h-12 mr-2 rounded "
                    />
                    {bizName}
                </div>

                {/* Date and Time */}
                <div className={`flex items-center
                    ${theme === "Dark"
                        ? " text-white"
                        : " text-black "
                    }`
                }
                >
                    <FaClock className={`mr-2 
                    ${theme === "Dark"
                            ? " text-white text-lg"
                            : " text-black text-lg"
                        }`
                    } />
                    <span>
                        {dateTime.toLocaleString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                </div>
                <div className="flex space-x-2  ">
                    {allowedPages.map(({ name, icon }) => (

                        <button
                            key={name}
                            onClick={() => setCurrentPage(name)}
                            className={`px-4 py-2 rounded-xl ${currentPage === name
                                ? `   ${theme === "Dark"
                                    ? "bg-gray-300 text-black"
                                    : " text-white bg-blue-600   "
                                } `
                                : ` ${theme === "Dark"
                                    ? "bg-blue-800 text-white "
                                    : "text-black bg-gray-100 shadow-xl border "
                                }`
                                } flex flex-col items-center justify-center`}
                        >
                            <span className="mb-1">{icon}</span> {/* Add the icon above the text with margin */}
                            {name}
                        </button>
                    ))}
                </div>

            </div>


            {/**  Mobile and tablet view navbar */}
            <div className={` top-0 z-50 shadow-xl w-screen text-sm block md:hidden   `}>

                <div className={`    ${theme === "Dark"
                    ? "bg-[#132962] text-white"
                    : " text-black   bg-white border-b shadow-xl"
                    } flex justify-between items-center px-4 py-1  shadow-xl `}>
                    <button onClick={() => setMenuOpen(!menuOpen)} >
                        <FaBars size={18} />
                    </button>
                    <div className="flex justify-center w-full">
                        <img src="/logo_safi.png" alt="logo" className="h-8" />
                    </div>
                    <div className="flex gap-2 items-center">
                        <FaSearch size={18} className=" mr-3" />
                    </div>
                </div>

                {menuOpen && (

                    <div className={`absolute p-4 shadow-xl text-black rounded-b-xl w-1/2 block md:hidden ${theme === "Dark" ? "bg-[#132962] text-white border-white" : " bg-white text-black border-blue-600"} `}>
                        {allowedPages.map((item, index) => (

                            <div key={index} className={`border-b ${theme === "Dark" ? "bg-[#132962] text-white border-white" : "text-black border-blue-600"}`}>
                                <button
                                    onClick={() => { setCurrentPage(item.name), setMenuOpen(false) }}
                                    className={`flex items-center gap-2 text-xs px-4 my-2 py-2 rounded-xl 
                ${currentPage === item.name
                                            ? `${theme === "Dark" ? "bg-gray-300 text-black" : "bg-blue-600 text-white"}`
                                            : `${theme === "Dark" ? "bg-[#132962] text-white" : "text-black bg-white "}`
                                        }`}
                                >
                                    {item.icon} {item.name}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={`p-4    
             ${theme === "Dark"
                    ? "bg-[#171941] text-white"
                    : " text-black bg-white  "
                }`
            }
            >{renderPage()}</div>
        </div>
    )
}

export default Header