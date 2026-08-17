"use client";

import { useUserTheme } from "@/app/componets/zustand/theme";
import React, { useState, useEffect } from "react";
import { FaWallet, FaPlus, FaFileExport, FaFolder, FaList, FaMoneyBillWave, FaTags, FaDollarSign, FaBoxOpen } from "react-icons/fa";
import { db, } from "../../../config";
import { ref, push, update, remove, set } from 'firebase/database';
import { useUserAccountName, useUserID } from "@/app/componets/zustand/profile";
import { TiTick } from "react-icons/ti";
import { TbXboxX } from "react-icons/tb";
import { useUserExpensesCategories, useUserExpensesCategoriesTotal } from "@/app/componets/zustand/expenseCategories";
import { useUserExpenses, useUserExpensesTotal } from "@/app/componets/zustand/expenses";

const Expenses = () => {

    const Id = useUserID((state) => state.userID)
    const theme = useUserTheme((state) => state.userTheme)
    const userAccountName = useUserAccountName((state) => state.userAccountName)
    const categoriesState = useUserExpensesCategories((state) => state.userExpensesCategories);
    const categories = Array.isArray(categoriesState) ? categoriesState : [];
    const categoriesTotal = useUserExpensesCategoriesTotal((state) => state.userExpensesCategoriesTotal)
    const expenses = useUserExpenses((state) => state.userExpenses)

    const expensesTotal = useUserExpensesTotal((state) => state.userExpensesTotal)

    // Dummy data (replace with real API)




    const [expenseMode, setExpenseMode] = useState("category");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [expenseNote, setExpenseNote] = useState("");



    /////Date modal 
    const [dateModal, setDateModal] = useState(false)

    const DateModalFun = () => {

        setDateModal(false)
    }
    const DateModalFunBtn = () => setDateModal(true)

    const [activeTab, setActiveTab] = useState("day");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedWeek, setSelectedWeek] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());



    const [manageModal, setManageModal] = useState(false)



    const manageModalFun = () => {

        setSelectedCategory('')
        setExpenseAmount('')
        setExpenseNote('')

        setManageModal(false)
    }



    /// Modals
    // Add 
    const [itemName, setItemName] = useState('')
    const [itemPrice, setItemPrice] = useState('')
    const [itemStock, setItemStock] = useState('')
    const [ItemCategory, setItemCategory] = useState('')

    const [occupied, setOccupied] = useState("");
    const [reserved, setReserved] = useState("");
    const [maintenanceRooms, setMaintenanceRooms] = useState("");

    const [catName, setCatName] = useState('')

    const [roomModal, setRoomModal] = useState(false)
    const [reserveModal, setReserveModal] = useState(false)
    const [checklistModal, setChecklistModal] = useState(false)
    const [catModal, setCatModal] = useState(false);
    const [catManageModal, setCatManageModal] = useState(false);

    const roomModalFun = () => {
        setItemName('')
        setItemPrice('')
        setItemStock('')
        setItemCategory('')
        setMaintenanceRooms('')

        setRoomModal(false)
    }



    const catModalFun = () => {
        setCatName('')
        setCatModal(false);
    }

    const catManageModalFun = () => {

        setCatManageModal(false);
    }

    const roomModalFunBtn = () => setRoomModal(true)
    const catModalFunBtn = () => setCatModal(true);



    /// Edit
    const [roomModalEdit, setRoomModalEdit] = useState(false)
    const [catModalEdit, setCatModalEdit] = useState(false);

    const roomModalFunEdit = () => {
        setItemName('')
        setItemPrice('')
        setItemStock('')
        setItemCategory('')
        setOccupied('')
        setReserved('')

        setRoomModalEdit(false)

    }
    const catModalFunEdit = () => {
        setCatName('')
        setCatModalEdit(false);
    }

    const roomModalFunBtnEdit = () => setRoomModalEdit(true)
    const catModalFunBtnEdit = () => setCatModalEdit(true);


    //// Delete 
    const [roomModalDelete, setRoomModalDelete] = useState(false)
    const [catModalDelete, setCatModalDelete] = useState(false);

    const roomModalFunDelete = () => {
        setRoomModalEdit(false)
        setRoomModalDelete(false)

    }
    const catModalFunDelete = () => setCatModalDelete(false);

    const roomModalFunBtnDelete = () => setRoomModalDelete(true)
    const catModalFunBtnDelete = () => setCatModalDelete(true);


    //// Auto Categories Modal
    const [addCatModalsuccess, setAddCatsuccess] = useState(false);
    const [addCatModalFail, setAddCatFail] = useState(false);
    const [addCatModalFailBlank, setAddCatFailBlank] = useState(false);

    const [editCatModalsuccess, setEditCatsuccess] = useState(false);
    const [editCatModalFail, setEditCatFail] = useState(false);

    const [deleteCatModalsuccess, setDeleteCatsuccess] = useState(false);
    const [deleteCatModalFail, setDeleteCatFail] = useState(false);

    const addCatsuccessFun = () => {
        setAddCatsuccess(true);
        setTimeout(() => setAddCatsuccess(false), 1500);
    };

    const addCatFailFun = () => {
        setAddCatFail(true);
        setTimeout(() => setAddCatFail(false), 1500);
    };

    const addCatFailBlankFun = () => {
        setAddCatFailBlank(true);
        setTimeout(() => setAddCatFailBlank(false), 1500);
    };

    const editCatsuccessFun = () => {
        setEditCatsuccess(true);
        setTimeout(() => setEditCatsuccess(false), 1500);
    };

    const editCatFailFun = () => {
        setEditCatFail(true);
        setTimeout(() => setEditCatFail(false), 1500);
    };

    const deleteCatsuccessFun = () => {
        setDeleteCatsuccess(true);
        setTimeout(() => setDeleteCatsuccess(false), 1500);
    };

    const deleteCatFailFun = () => {
        setDeleteCatFail(true);
        setTimeout(() => setDeleteCatFail(false), 1500);
    };



    const addCategory = async () => {

        if (Id) {

            if (catName) {
                try {
                    const dbRef = ref(db, `web/pos/${Id}/expensecategories/`);

                    const newbranchRef = push(dbRef, {

                        Name: catName,

                    });
                    const newCreditKey = newbranchRef.key;

                    catModalFun()
                    addCatsuccessFun()
                }
                catch {
                    console.log('did not add category')
                    catModalFunEdit()
                    addCatFailFun()
                }
            }
            else {
                catModalFunEdit()
                addCatFailBlankFun()
            }

        }

    };


    const [catDeleteID, setCatDeleteId] = useState()
    const [catdeleteName, setCatDeleteName] = useState()

    const catDeletesetID = (id, jina) => {

        catModalFunBtnDelete()
        setCatDeleteId(id)
        setCatDeleteName(jina)
    }

    const deleteCategory = async () => {

        if (Id) {

            if (categoriesTotal == 1) {

                remove(ref(db, `web/pos/${Id}/expensecategories`)).then(() => {

                    useUserExpensesCategories.setState({ userExpensesCategories: null });
                    useUserExpensesCategoriesTotal.setState({ userExpensesCategoriesTotal: null });
                    catModalFunDelete()
                    deleteCatsuccessFun()

                })
                    .catch((error) => {
                        catModalFunDelete()
                        deleteCatFailFun()
                    });

            } else {
                remove(ref(db, `web/pos/${Id}/expensecategories/${catDeleteID}`)).then(() => {
                    catModalFunDelete()
                    deleteCatsuccessFun()

                })
                    .catch((error) => {
                        catModalFunDelete()
                        deleteCatFailFun()
                    });
            }
        }
    };

    const [catEditID, setCatEditId] = useState()

    const catEditsetID = (id, jina) => {

        catModalFunBtnEdit()
        setCatEditId(id)
        setCatName(jina)
    }

    const editCategories = async (id) => {

        if (Id) {

            if (catName) {

                try {

                    const dbRef = ref(db, `web/pos/${Id}/expensecategories/${catEditID}`);
                    const newbranchRef = update(dbRef, {

                        Name: catName,

                    });


                    catModalFunEdit()
                    editCatsuccessFun()

                }
                catch (error) {
                    console.log('did not edit category', error)
                    catModalFunEdit()
                    editCatFailFun()
                }
            }
            else {
                catModalFunEdit()
                addCatFailBlankFun()
            }
        }
    };



    //// Auto Items modals
    const [addItemModalsuccess, setAddItemsuccess] = useState(false);
    const [addItemModalFail, setAddItemFail] = useState(false);
    const [addItemModalFailBlank, setAddItemFailBlank] = useState(false);

    const [editItemModalsuccess, setEditItemsuccess] = useState(false);
    const [editItemModalFail, setEditItemFail] = useState(false);

    const [deleteItemModalsuccess, setDeleteItemsuccess] = useState(false);
    const [deleteItemModalFail, setDeleteItemFail] = useState(false);


    const addItemsuccessFun = () => {
        setAddItemsuccess(true);
        setTimeout(() => setAddItemsuccess(false), 1500);
    };

    const addItemFailFun = () => {
        setAddItemFail(true);
        setTimeout(() => setAddItemFail(false), 1500);
    };

    const addItemFailBlankFun = () => {
        setAddItemFailBlank(true);
        setTimeout(() => setAddItemFailBlank(false), 1500);
    };

    const editItemsuccessFun = () => {
        setEditItemsuccess(true);
        setTimeout(() => setEditItemsuccess(false), 1500);
    };

    const editItemFailFun = () => {
        setEditItemFail(true);
        setTimeout(() => setEditItemFail(false), 1500);
    };

    const deleteItemsuccessFun = () => {
        setDeleteItemsuccess(true);
        setTimeout(() => setDeleteItemsuccess(false), 1500);
    };

    const deleteItemFailFun = () => {
        setDeleteItemFail(true);
        setTimeout(() => setDeleteItemFail(false), 1500);
    };



    ////// Handlers for room operations
    const addItem = async () => {
        if (!Id) return;

        if (selectedCategory && expenseAmount) {
            try {

                const dbRef = ref(db, `web/pos/${Id}/expenses/`);

                push(dbRef, {
                    Category: selectedCategory,
                    Amount: Number(expenseAmount),
                    Note: expenseNote || "",
                    AddedBy: userAccountName,
                    Date: Date.now()
                });

                manageModalFun();
                addItemsuccessFun();

            } catch (error) {

                console.log("Expense not saved", error);

                manageModalFun();
                addItemFailFun();
            }

        } else {

            manageModalFun();
            addItemFailBlankFun();
        }
    };


    const [roomEditId, setRoomEditId] = useState("");


    const [itemAmount, setItemAmount] = useState("");
    const [itemNote, setItemNote] = useState("");
    const [itemAddedBy, setItemAddedBy] = useState("");
    const [itemDate, setItemDate] = useState("");

    const [oldItem, setOldItem] = useState({});

    //// LOAD ROOM DATA INTO EDIT FORM
    //// LOAD ITEM DATA INTO EDIT FORM
    const itemEditsetID = (
        id,
        category,
        amount,
        note,
        addedBy,
        date
    ) => {
        roomModalFunBtnEdit();

        setRoomEditId(id);

        // OLD VALUES
        setOldItem({
            Id: id,
            Category: category,
            Amount: amount,
            Note: note,
            AddedBy: addedBy,
            Date: date
        });

        // FORM VALUES
        setItemCategory(category);
        setItemAmount(amount);
        setItemNote(note);
        setItemAddedBy(addedBy);
        setItemDate(date);
    };



    //// STORE CHANGE DETAILS
    const [changeDetails, setChangeDetails] = useState([]);

    const getChangedDetails = () => {

        let changes = [];

        if (oldItem.Name !== itemName) {
            changes.push(`Name changed from "${oldItem.Name}" → "${itemName}"`);
        }

        if (oldItem.Category !== ItemCategory) {
            changes.push(`Category changed from "${oldItem.Category}" → "${ItemCategory}"`);
        }

        if (oldItem.Price !== itemPrice) {

            const diff = itemPrice - oldItem.Price;

            const diffText =
                diff > 0
                    ? `increased by ${diff}`
                    : `decreased by ${Math.abs(diff)}`;

            changes.push(`Price changed: ${oldItem.Price} → ${itemPrice} (${diffText})`);
        }


        if (oldItem.Stock !== itemStock) {

            console.log("olditem", oldItem)

            const diff = itemStock - oldItem.Stock;

            const diffText =
                diff > 0
                    ? `increased by ${diff}`
                    : `decreased by ${Math.abs(diff)}`;

            changes.push(
                `Available rooms changed: ${oldItem.Stock} → ${itemStock} (${diffText})`
            );
        }


        if (oldItem.Maintenance !== maintenanceRooms) {

            const diff = maintenanceRooms - oldItem.Maintenance;

            const diffText =
                diff > 0
                    ? `increased by ${diff}`
                    : `decreased by ${Math.abs(diff)}`;

            changes.push(
                `Maintenance rooms changed: ${oldItem.Maintenance} → ${maintenanceRooms} (${diffText})`
            );
        }

        return changes;

    };



    //// EDIT ROOM
    const editItem = async () => {

        if (!Id) return;

        try {

            const dbRef = ref(db, `web/pos/${Id}/expenses/${oldItem.Id}`);

            await update(dbRef, {

                Category: oldItem.Category,
                Amount: Number(oldItem.Amount),
                Note: oldItem.Note,
                AddedBy: userAccountName,
                Date: Date.now()
            });


            roomModalFunEdit();
            editItemsuccessFun();

        } catch (error) {

            console.log("Did not edit Room", error);

            roomModalFunEdit();
            editItemFailFun();

        }

    };



    const [roomdeleteID, setRoomDeleteId] = useState()


    const roomDeletesetID = (id) => {

        roomModalFunBtnDelete()
        setRoomDeleteId(id)
    }


    const deleteItem = async () => {
        if (!Id) return;

        try {
            // Now delete the room
            if (expensesTotal === 1) {
                await remove(ref(db, `web/pos/${Id}/expenses/`));
                useUserExpenses.setState({ userExpense: null });
                useUserExpensesTotal.setState({ userExpenseTotal: null });
            } else {
                await remove(ref(db, `web/pos/${Id}/expenses/${roomdeleteID}`));

            }

            roomModalFunDelete();
            deleteItemsuccessFun();

        } catch (error) {
            console.log("did not delete expenses", error);
            roomModalFunDelete();
            deleteItemFailFun();
        }
    };



    return (


        <div
            className={`min-h-screen flex flex-col
  ${theme === "Dark"
                    ? "text-white"
                    : "bg-white text-black"
                }`}
        >

            <div
                className={`flex flex-col flex-grow w-full
    px-3 sm:px-6 lg:px-8
    md:w-11/12 lg:w-4/5 xl:w-3/4
    mx-auto
    ${theme === "Dark"
                        ? "text-white"
                        : "bg-gray-100 text-black rounded-lg"
                    }`}
            >

                {/* ================= HEADER ================= */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-4 border-b">

                    <h1 className="text-sm sm:text-lg font-bold">
                        Expenses
                    </h1>

                    <div className="flex flex-row sm:flex-row gap-3 w-full sm:w-auto ">


                    </div>
                </div>






                {/* ================= EXPENSE TABLE ================= */}
                <div className="mb-6">

                    {/* HEADER */}
                    <div className="flex items-center justify-around mb-4">

                        <button

                            onClick={() => (setCatManageModal(true))}
                            className={`px-4 py-2 rounded-lg shadow text-xs sm:text-sm flex items-center gap-2 transition
        ${theme === "Dark"
                                    ? "bg-blue-800 hover:bg-blue-600 text-white"
                                    : "bg-blue-600 hover:bg-blue-800 text-white"
                                }`}  >
                            Manage Categories
                        </button>


                        {/* Add Button */}
                        <button
                            className={`px-4 py-2 rounded-lg shadow text-xs sm:text-sm flex items-center gap-2 transition
        ${theme === "Dark"
                                    ? "bg-blue-800 hover:bg-blue-600 text-white"
                                    : "bg-blue-600 hover:bg-blue-800 text-white"
                                }`}
                            onClick={() => setManageModal(true)}
                        >
                            Add Expense
                        </button>



                    </div>

                    {/* MOBILE VIEW: Stacked Cards (Hidden on PC) */}
                    <div className="block md:hidden space-y-4  h-screen overflow-y-auto ">


                        {expenses ? (
                            [...expenses].reverse().map((item) => (
                                <div
                                    key={item.id}
                                    className={`p-4 rounded-xl shadow-md border-l-4 border-blue-600 transition-all ${theme === "Dark"
                                        ? "bg-gray-900 border-blue-800 text-gray-200"
                                        : "bg-white text-gray-800"
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider opacity-60">
                                                {new Date(item.Date).toLocaleString()}
                                            </p>
                                            <h3 className="text-sm ">{item.Note}</h3>
                                        </div>

                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                                            {item.Category}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs mt-3 border-t pt-3 border-gray-100 dark:border-blue-900/30">
                                        <div>
                                            <p className="text-gray-500">Amount</p>
                                            <p className="font-semibold text-blue-600">
                                                Ksh {parseInt(item.Amount).toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-4 pt-2">
                                        <span className="text-xs italic opacity-70">
                                            By: {item.AddedBy}
                                        </span>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    itemEditsetID(
                                                        item.id,
                                                        item.Category,
                                                        item.Amount,
                                                        item.Note,
                                                        item.AddedBy,
                                                        item.Date
                                                    );
                                                }}
                                                className={`py-1 px-2 mt-2 mx-2 rounded text-xs sm:text-sm ${theme === "Dark"
                                                    ? "text-white bg-blue-800 hover:bg-blue-600"
                                                    : "bg-blue-600 text-white hover:bg-blue-800"
                                                    }`}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    roomDeletesetID(item.id);
                                                }}
                                                className={`px-2 py-1 mx-2 mt-2 rounded text-xs sm:text-sm ${theme === "Dark"
                                                    ? "text-white bg-red-800 hover:bg-red-600"
                                                    : "bg-red-600 text-white hover:bg-red-800"
                                                    }`}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 w-full overflow-hidden animate-in fade-in duration-1000">

                                {/* --- Animation Container --- */}
                                <div className="relative mb-12">

                                    {/* Soft Background Glow - The "Financial Rhythm" */}
                                    <div className={`absolute inset-0 scale-[2] blur-[80px] opacity-20 animate-[pulse_6s_ease-in-out_infinite]
            ${theme === "Dark" ? "bg-blue-400" : "bg-blue-600"}`}></div>

                                    {/* Expense Icon - Smooth Vertical Slide Rhythm */}
                                    <div className="relative z-10 animate-[expenseSlide_4s_ease-in-out_infinite] group">
                                        <FaWallet
                                            className={`text-7xl transition-all duration-700 group-hover:scale-110 
                ${theme === "Dark" ? "text-white/90" : "text-blue-700"}`}
                                        />

                                        {/* Minimalist Accent - A small "Safe" indicator */}
                                        <div className="absolute -bottom-1 -right-1">
                                            <div className={`w-4 h-4 rounded-full border-2 ${theme === "Dark" ? "border-blue-300" : "border-blue-500"} animate-pulse`}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* --- Text Section --- */}
                                <div className="text-center px-4 max-w-md">

                                    {/* Punchy Heading */}
                                    <h1 className={`text-2xl sm:text-3xl font-black tracking-tight opacity-0 animate-[fadeInSlide_0.8s_ease-out_forwards]
            ${theme === "Dark" ? "text-white" : "text-gray-900"}`}>
                                        No Expenses
                                    </h1>

                                    {/* Decorative Divider - Grows to represent a balance line */}
                                    <div className={`h-[3px] w-0 mx-auto my-5 bg-blue-500 animate-[growLine_1.2s_ease-in-out_0.4s_forwards]`}></div>

                                    <p className={`text-sm font-medium leading-relaxed opacity-0 animate-[fadeInSlide_0.8s_ease-out_0.7s_forwards]
            ${theme === "Dark" ? "text-gray-400" : "text-gray-500"}`}>
                                        Your financial records are clear. Start tracking your outgoings by adding your first expense.
                                    </p>
                                </div>

                                {/* --- Custom Rhythm Keyframes --- */}
                                <style jsx>{`
        @keyframes expenseSlide {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
        }
        @keyframes fadeInSlide {
            from { opacity: 0; transform: translateY(20px); filter: blur(10px); }
            to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes growLine {
            from { width: 0; }
            to { width: 80px; }
        }
    `}</style>
                            </div>
                        )}

                    </div>

                    {/* PC VIEW: Polished Table (Hidden on Mobile) */}
                    <div
                        className={`hidden md:block h-screen overflow-y-auto  rounded-xl shadow-2xl transition-all  ${theme === "Dark" ? " border border-blue-800" : "bg-white"
                            }`}
                    >
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={theme === "Dark" ? "bg-blue-900/50 text-blue-200" : "bg-blue-600 text-white"}>
                                    <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Date</th>
                                    <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Added By</th>
                                    <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Category</th>
                                    <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Description</th>
                                    <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider ">Amount</th>


                                    <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-blue-900/30">


                                {expenses ? (

                                    [...expenses].map((item) => (
                                        <tr
                                            key={item.id}
                                            className={`transition-colors duration-200 ${theme === "Dark"
                                                ? "hover:bg-blue-900/20 text-white"
                                                : "hover:bg-blue-50 text-black"
                                                }`}
                                        >

                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {new Date(item.Date).toLocaleString()}
                                            </td>

                                            <td className="px-6 py-4 text-sm italic">
                                                {item.AddedBy}
                                            </td>

                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`rounded-full font-bold text-xs ${theme === "Dark" ? "text-white" : "text-black"
                                                        }`}
                                                >
                                                    {item.Category}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-xs">
                                                {item.Note}
                                            </td>

                                            <td className="px-6 py-4 text-sm font-mono font-bold text-blue-600">

                                                Ksh {parseInt(item.Amount).toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-4">

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            itemEditsetID(
                                                                item.id,
                                                                item.Category,
                                                                item.Amount,
                                                                item.Note,
                                                                item.AddedBy,
                                                                item.Date
                                                            )
                                                        }}

                                                        className={`py-1 px-2 mt-2 mx-2 rounded text-xs sm:text-sm ${theme === "Dark"
                                                            ? "text-white bg-blue-800 hover:bg-blue-600"
                                                            : "bg-blue-600 text-white hover:bg-blue-800"
                                                            }`}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            roomDeletesetID(item.id)
                                                        }}

                                                        className={`px-2 py-1 mx-2 mt-2 rounded text-xs sm:text-sm ${theme === "Dark"
                                                            ? "text-white bg-red-800 hover:bg-red-600"
                                                            : "bg-red-600 text-white hover:bg-red-800"
                                                            }`}
                                                    >
                                                        Delete
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    )
                                    )
                                ) : (
                                    <tr
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        </td>
                                    </tr>
                                )
                                }

                            </tbody>
                        </table>
                    </div>
                </div>

            </div>


            {manageModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div
                        className={`p-6 rounded-xl shadow-lg w-96 mx-4
        ${theme === "Dark" ? "bg-[#171941]" : "bg-white"}
      `}
                    >
                        <h2 className="text-md sm:text-lg font-bold mb-4 text-center">
                            Add Expenses
                        </h2>

                        <div className="space-y-4">

                            {/* CATEGORY SELECT */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Select Category
                                </label>

                                <div className="relative mt-2">

                                    <select
                                        className="w-full p-3 border border-gray-300 rounded pl-10 shadow-md text-sm"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="">Choose category</option>
                                        <option value="none">None</option>

                                        {Array.isArray(categories) &&
                                            categories.map((category) => (
                                                <option key={category.id} value={category.Name}>
                                                    {category.Name}
                                                </option>
                                            ))}
                                    </select>

                                    <FaList className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
                                </div>
                            </div>

                            {/* AMOUNT */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Amount
                                </label>

                                <div className="relative mt-2">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Enter amount"
                                        className="w-full p-3 border border-gray-300 rounded pl-10 shadow-md text-sm"
                                        value={expenseAmount}
                                        onChange={(e) => setExpenseAmount(e.target.value)}
                                    />
                                    <FaMoneyBillWave className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
                                </div>
                            </div>

                            {/* NOTE */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Description (Optional)
                                </label>

                                <div className="relative mt-2">
                                    <textarea
                                        rows="2"
                                        placeholder="Enter note"
                                        className="w-full p-3 border border-gray-300 rounded shadow-md text-sm"
                                        value={expenseNote}
                                        onChange={(e) => setExpenseNote(e.target.value)}
                                    />
                                </div>
                            </div>

                        </div>


                        <div className="flex justify-evenly mt-6">

                            <button
                                onClick={
                                    addItem
                                }
                                className={`px-4 py-2 rounded-lg text-sm text-white
            ${expenseMode === "category"
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "bg-green-600 hover:bg-green-700"
                                    }`}
                            >
                                Save Expense
                            </button>

                            <button
                                className={`${theme === "Dark"
                                    ? "bg-red-800 hover:bg-red-600"
                                    : "bg-red-600 hover:bg-red-800"
                                    }
          text-white px-4 py-2 rounded text-sm`}
                                onClick={manageModalFun}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {roomModalEdit && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div
                        className={`p-6 rounded-xl shadow-lg w-96 mx-4
            ${theme === "Dark" ? "bg-[#171941]" : "bg-white"}`}
                    >

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm sm:text-lg font-bold">Edit Expense</h3>

                            <button
                                className={`px-5 py-2 rounded-lg text-white font-medium
                    ${theme === "Dark"
                                        ? "bg-red-700 hover:bg-red-600"
                                        : "bg-red-600 hover:bg-red-700"}`}
                                onClick={() => roomDeletesetID(roomEditID, oldItem.Name)}
                            >
                                Delete
                            </button>
                        </div>


                        <div className="space-y-4">

                            {/* CATEGORY */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Select Category
                                </label>

                                <div className="relative mt-2">
                                    <select
                                        className="w-full p-3 border border-gray-300 rounded pl-10 shadow-md text-sm"
                                        value={oldItem.Category}
                                        onChange={(e) =>
                                            setOldItem({
                                                ...oldItem,
                                                Category: e.target.value
                                            })
                                        }
                                    >
                                        <option value="">Choose category</option>
                                        <option value="none">None</option>

                                        {Array.isArray(categories) &&
                                            categories.map((category) => (
                                                <option key={category.id} value={category.Name}>
                                                    {category.Name}
                                                </option>
                                            ))}
                                    </select>

                                    <FaList className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
                                </div>
                            </div>


                            {/* AMOUNT */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Amount
                                </label>

                                <div className="relative mt-2">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Enter amount"
                                        className="w-full p-3 border border-gray-300 rounded pl-10 shadow-md text-sm"
                                        value={oldItem.Amount}
                                        onChange={(e) =>
                                            setOldItem({
                                                ...oldItem,
                                                Amount: e.target.value
                                            })
                                        }
                                    />
                                    <FaMoneyBillWave className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />
                                </div>
                            </div>


                            {/* NOTE */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Description (Optional)
                                </label>

                                <div className="relative mt-2">
                                    <textarea
                                        rows="2"
                                        placeholder="Enter note"
                                        className="w-full p-3 border border-gray-300 rounded shadow-md text-sm"
                                        value={oldItem.Note}
                                        onChange={(e) =>
                                            setOldItem({
                                                ...oldItem,
                                                Note: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </div>

                        </div>


                        {/* BUTTONS */}
                        <div className="flex justify-evenly mt-6">

                            <button
                                className={`px-5 py-2 rounded text-white font-medium
                    ${theme === "Dark"
                                        ? "bg-green-700 hover:bg-green-600"
                                        : "bg-green-600 hover:bg-green-700"}`}
                                onClick={editItem}
                            >
                                Save
                            </button>

                            <button
                                className={`px-5 py-2 rounded text-white font-medium text-xs sm:text-base
                    ${theme === "Dark"
                                        ? "bg-red-800 hover:bg-red-600"
                                        : "bg-red-600 hover:bg-red-800"}`}
                                onClick={roomModalFunEdit}
                            >
                                Back
                            </button>

                        </div>

                    </div>
                </div>
            )}

            {/* Rooms delete*/}
            {roomModalDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className={` p-6 rounded-xl shadow w-96  mx-4
                        ${theme === "Dark"
                            ? " bg-[#171941] "
                            : " bg-white "
                        }`
                    }>
                        <h2 className="text-sm sm:text-lg font-bold mb-4 text-center">Delete Room</h2>

                        <div className="mt-4 font-semibold text-sm sm:text-md">
                            Are you sure you want to delete this Room ?
                        </div>

                        <div className=" flex flex-row justify-evenly">
                            <button
                                className={` text-white px-4 py-2 rounded  mt-4  text-sm sm:text-base
                                
                              ${theme === "Dark"
                                        ? "bg-green-800  hover:bg-green-600"
                                        : "bg-green-600  hover:bg-green-800 "
                                    }`}
                                onClick={() => deleteItem()}
                            >
                                Ok
                            </button>
                            <button
                                className={` text-white px-4 py-2 rounded mt-4 text-sm sm:text-base
                                  ${theme === "Dark"
                                        ? "bg-red-800  hover:bg-red-600"
                                        : "bg-red-600  hover:bg-red-800 "
                                    }`}
                                onClick={() => roomModalFunDelete()}
                            >
                                Cancel
                            </button>
                        </div>

                    </div>
                </div>
            )}



            {/**Date Modal */}
            {dateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
                    <div className={` p-6 rounded-xl shadow w-96  mx-4
                        ${theme === "Dark"
                            ? " bg-[#171941] "
                            : " bg-white "
                        }`
                    }>

                        <h2 className="text-md sm:text-xl font-bold text-center mb-4">Select Date Range</h2>

                        <div className="flex justify-between mb-4 border-b">
                            <button
                                onClick={() => setActiveTab("day")}
                                className={`py-2 px-4 text-sm sm:text-base ${activeTab === "day" ? "border-b-2 border-blue-500 text-blue-500 font-bold" : "text-gray-500"}`}
                            >
                                Day
                            </button>
                            <button
                                onClick={() => setActiveTab("week")}
                                className={`py-2 px-4  text-sm sm:text-base ${activeTab === "week" ? "border-b-2 border-blue-500 text-blue-500 font-bold" : "text-gray-500"}`}
                            >
                                Week
                            </button>
                            <button
                                onClick={() => setActiveTab("month")}
                                className={`py-2 px-4  text-sm sm:text-base ${activeTab === "month" ? "border-b-2 border-blue-500 text-blue-500 font-bold" : "text-gray-500"}`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setActiveTab("year")}
                                className={`py-2 px-4  text-sm sm:text-base ${activeTab === "year" ? "border-b-2 border-blue-500 text-blue-500 font-bold" : "text-gray-500"}`}
                            >
                                Year
                            </button>
                        </div>

                        {/* Content for Each Tab */}
                        {activeTab === "day" && (
                            <div className="mb-4">
                                <label className={`block  text-xs sm:text-sm font-medium mb-2   
                                 ${theme === "Dark "
                                        ? "text-white"
                                        : " text-black  "
                                    }`}
                                >Select a Day</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full px-4 py-2 border rounded focus:ring-2   focus:outline-none text-black text-sm sm:text-base "
                                />
                            </div>
                        )}

                        {activeTab === "week" && (
                            <div className="mb-4">
                                <label className={`block text-xs sm:text-sm font-medium  mb-2
                                   ${theme === "Dark"
                                        ? "text-white"
                                        : " text-black  "
                                    }`}
                                >Select a Week</label>
                                <input
                                    type="week"
                                    value={selectedWeek}
                                    onChange={(e) => setSelectedWeek(e.target.value)}
                                    className="w-full px-4 py-2 border rounded focus:ring-2   focus:outline-none text-black"
                                />
                            </div>
                        )}

                        {activeTab === "month" && (
                            <div className="mb-4">
                                <label className={`block text-xs sm:text-sm font-medium  mb-2
                                   ${theme === "Dark"
                                        ? "text-white"
                                        : " text-black  "
                                    }`}
                                >Select a Month</label>
                                <input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="w-full px-4 py-2 border rounded focus:ring-2   focus:outline-none text-black"
                                />
                            </div>
                        )}

                        {activeTab === "year" && (
                            <div className="mb-4">
                                <label className={`block text-xs sm:text-sm font-medium text-gray-700 mb-2
                                   ${theme === "Dark"
                                        ? "text-white"
                                        : " text-black  "
                                    }`}
                                >Select a Year</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="w-full px-4 py-2 border rounded focus:ring-2   focus:outline-none text-black"
                                >
                                    {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex justify-around mt-3">
                            <button
                                onClick={() => {
                                    handleFilter();

                                    handleLogsFilter();
                                }}
                                className={` text-white px-4 py-2 rounded  mt-4  text-xs sm:text-base
                                
                              ${theme === "Dark"
                                        ? "bg-green-800  hover:bg-green-600"
                                        : "bg-green-600  hover:bg-green-800 "
                                    }`}
                            >
                                Apply Filter
                            </button>
                            <button
                                onClick={DateModalFun}
                                className={` text-white px-4 py-2 rounded mt-4 text-xs sm:text-base
                                  ${theme === "Dark"
                                        ? "bg-red-800  hover:bg-red-600"
                                        : "bg-red-600  hover:bg-red-800 "
                                    }`}
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
            )}




            {/*Categories modal */}
            {
                catManageModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                        <div
                            className={`p-6 rounded-xl shadow-lg w-96 mx-4
                                        ${theme === "Dark" ? "bg-[#171941]" : "bg-white"}
                                    `}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h3 className=" text-sm sm:text-lg font-bold ">Manage Categories</h3>


                                <button
                                    className={`px-5 py-2 rounded-2xl text-white font-medium  text-xs sm:text-base
                                                ${theme === "Dark"
                                            ? "bg-red-800 hover:bg-red-600"
                                            : "bg-red-600 hover:bg-red-800"
                                        }`}
                                    onClick={catManageModalFun}
                                >
                                    Back
                                </button>
                            </div>

                            {/* Scrollable Categories Section */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-1 px-5 sm:px-10 pt-1 overflow-y-auto">
                                {categories && categories.map((category, index) => (
                                    <div
                                        key={index}
                                        className={`shadow-lg text-center p-3 sm:p-4 rounded-xl sm:my-1 
                        ${theme === "Dark" ? "border border-blue-800" : "bg-white hover:bg-blue-200"}`}
                                    >
                                        <p className="font-semibold text-sm sm:text-md">{category.Name}</p>
                                        <button
                                            className={`py-1 px-2 mt-2 mx-2 rounded  text-xs sm:text-sm ${theme === "Dark"
                                                ? "text-white bg-blue-800 hover:bg-blue-600"
                                                : "bg-blue-600 text-white hover:bg-blue-800"
                                                }`}
                                            onClick={() => catEditsetID(category.id, category.Name)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={`px-2 py-1 mx-2 mt-2 rounded text-xs sm:text-sm  ${theme === "Dark"
                                                ? "text-white bg-red-800 hover:bg-red-600"
                                                : "bg-red-600 text-white hover:bg-red-800"
                                                }`}
                                            onClick={() => catDeletesetID(category.id, category.Name)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}

                                {!categories &&
                                    <div className="flex flex-col items-center mt-20">
                                        <FaTags className={`text-4xl ${theme === "Dark" ? "text-white" : "text-black"}`} />
                                        <h1 className="text-lg mt-2">No Categories Added</h1>
                                    </div>
                                }
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex justify-evenly mt-6">

                                <button
                                    className={`text-xs sm:text-sm px-3 sm:m-0 m-1 py-1 rounded ${theme === "Dark"
                                        ? "text-white bg-green-800 hover:bg-green-600"
                                        : "bg-green-600 text-white hover:bg-green-800"
                                        }`}
                                    onClick={() => setCatModal(true)}
                                >
                                    + Add Category
                                </button>



                            </div>
                        </div>
                    </div>
                )
            }


            {
                catModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                        <div
                            className={`p-6 rounded-xl shadow-lg w-96 mx-4
                                        ${theme === "Dark" ? "bg-[#171941]" : "bg-white"}
                                    `}
                        >
                            <h2 className="text-md sm:text-lg font-bold mb-5 text-center">
                                Add Category
                            </h2>

                            <div className="space-y-2">

                                {/* CATEGORY NAME */}
                                <div>
                                    <label className="text-xs sm:text-sm font-medium text-gray-600">
                                        Category Name
                                    </label>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter category name"
                                            className="w-full p-3 border border-gray-300 rounded text-sm sm:text-base
                                                    focus:outline-none focus:ring-2 focus:ring-[#303133]
                                                    pl-12 shadow-md"
                                            style={{ color: "#000000" }}
                                            value={catName}
                                            onChange={(e) => setCatName(e.target.value)}
                                        />
                                        <FaTags className="absolute left-3 top-1/2 -translate-y-1/2 text-black text-lg" />
                                    </div>
                                </div>

                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex justify-evenly mt-6">
                                <button
                                    className={`px-5 py-2 rounded text-white font-medium text-xs sm:text-base
                                                ${theme === "Dark"
                                            ? "bg-green-800 hover:bg-green-600"
                                            : "bg-green-600 hover:bg-green-800"
                                        }`}
                                    onClick={addCategory}
                                >
                                    Add
                                </button>

                                <button
                                    className={`px-5 py-2 rounded text-white font-medium  text-xs sm:text-base
                                                ${theme === "Dark"
                                            ? "bg-red-800 hover:bg-red-600"
                                            : "bg-red-600 hover:bg-red-800"
                                        }`}
                                    onClick={catModalFun}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }


            {/*Categories edit */}
            {
                catModalEdit && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                        <div
                            className={`p-6 rounded-xl shadow-lg w-96 m-4
                                        ${theme === "Dark" ? "bg-[#171941]" : "bg-white"}
                                    `}
                        >
                            <h2 className="text-sm sm:text-lg font-bold mb-5 text-center">
                                Edit Category
                            </h2>

                            <div className="space-y-2">

                                {/* CATEGORY NAME */}
                                <div>
                                    <label className="text-xs sm:text-sm font-medium text-gray-600">
                                        Category Name
                                    </label>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter category name"
                                            className="w-full p-3 border border-gray-300 rounded text-xs sm:text-base
                                                    focus:outline-none focus:ring-2 focus:ring-[#303133]
                                                    pl-12 shadow-md"
                                            style={{ color: "#000000" }}
                                            value={catName}
                                            onChange={(e) => setCatName(e.target.value)}
                                        />
                                        <FaTags className="absolute left-3 top-1/2 -translate-y-1/2 text-black text-lg" />
                                    </div>
                                </div>

                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex justify-evenly mt-6">
                                <button
                                    className={`px-5 py-2 rounded text-white font-medium text-xs sm:text-base
                                                ${theme === "Dark"
                                            ? "bg-green-800 hover:bg-green-600"
                                            : "bg-green-600 hover:bg-green-800"
                                        }`}
                                    onClick={editCategories}
                                >
                                    Save
                                </button>

                                <button
                                    className={`px-5 py-2 rounded text-white font-medium text-xs sm:text-base
                                                ${theme === "Dark"
                                            ? "bg-red-800 hover:bg-red-600"
                                            : "bg-red-600 hover:bg-red-800"
                                        }`}
                                    onClick={catModalFunEdit}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/*Categories delete */}
            {
                catModalDelete && (
                    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-80">
                        <div className={` p-6 rounded-xl shadow w-96  mx-4
                                                ${theme === "Dark"
                                ? " bg-[#171941] "
                                : " bg-white "
                            }`
                        }>
                            <h2 className="text-sm sm:text-lg font-bold mb-4 text-center">Delete Category </h2>

                            <div className="mt-4 font-semibold text-sm sm:text-md">
                                Are you sure you want to delete this category?
                            </div>
                            <div className=" flex flex-row justify-evenly">
                                <button
                                    className={` text-white px-4 py-2 rounded  mt-4  text-xs sm:text-base
                                                        
                                                      ${theme === "Dark"
                                            ? "bg-green-800  hover:bg-green-600"
                                            : "bg-green-600  hover:bg-green-800 "
                                        }`}
                                    onClick={deleteCategory}
                                >
                                    OK
                                </button>
                                <button
                                    className={` text-white px-4 py-2 rounded mt-4 text-xs sm:text-base
                                                          ${theme === "Dark"
                                            ? "bg-red-800  hover:bg-red-600"
                                            : "bg-red-600  hover:bg-red-800 "
                                        }`}
                                    onClick={catModalFunDelete}
                                >
                                    Close
                                </button>
                            </div>

                        </div>
                    </div>
                )
            }









            {
                addCatModalsuccess && (
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
                            <p>The Category was Added</p>
                        </div>
                    </div>
                )
            }

            {
                addCatModalFail && (
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
                            <p>The Category was not Added</p>
                        </div>
                    </div>
                )
            }


            {
                addCatModalFailBlank && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                        <div className={` p-6 rounded-xl 
                    
                     ${theme === "Dark"
                                ? " bg-[#171941] "
                                : " bg-white shadow-lg "
                            }`}
                        >
                            <div className='flex justify-center'>
                                <TbXboxX className='text-red-600 text-3xl   ' />
                                <h2 className="text-lg font-bold mb-4 mx-1">Failed</h2>
                            </div>
                            <p>Fill all Fields</p>
                        </div>
                    </div>
                )
            }


            {
                editCatModalsuccess && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                        <div className={` p-6 rounded-xl 
                    
                     ${theme === "Dark"
                                ? " bg-[#171941] "
                                : " bg-white shadow-lg "
                            }`}>
                            <div className='flex justify-center'>

                                <div className='flex justify-center'>

                                    <TiTick className='text-green-600 text-4xl  ' />
                                    <h2 className="text-lg font-bold mb-4">Success</h2>
                                </div>
                            </div>
                            <p>The Category was Edited</p>
                        </div>
                    </div>
                )
            }



            {
                editCatModalFail && (
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
                            <p>The Category was not Edited</p>
                        </div>
                    </div>
                )
            }


            {
                deleteCatModalsuccess && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                        <div className={` p-6 rounded-xl 
                    
                     ${theme === "Dark"
                                ? " bg-[#171941] "
                                : " bg-white shadow-lg "
                            }`}>
                            <div className='flex justify-center'>
                                <TiTick className='text-green-600 text-4xl  ' />
                                <h2 className="text-lg font-bold mb-4">Deleted</h2>
                            </div>
                            <p>The Category was Deleted</p>
                        </div>
                    </div>
                )
            }

            {
                deleteCatModalFail && (
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
                            <p>The Category was not Deleted</p>
                        </div>
                    </div>
                )
            }


            {/**items auto modal */}
            {
                addItemModalsuccess && (
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

                            <p>The Expense was Added</p>
                        </div>
                    </div>
                )
            }

            {
                addItemModalFail && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
                        <div className={` p-6 rounded-xl 
                          
                           ${theme === "Dark"
                                ? " bg-[#171941] "
                                : " bg-white shadow-lg "
                            }`} >
                            <div className='flex justify-center'>
                                <TbXboxX className='text-red-600 text-3xl   ' />
                                <h2 className="text-lg font-bold mb-4 mx-1">Failed</h2>
                            </div>
                            <p>The Expense was not Added</p>
                        </div>
                    </div>
                )
            }

            {
                addItemModalFailBlank && (
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
                            <p>Fill all Fields</p>
                        </div>
                    </div>
                )
            }

            {
                editItemModalsuccess && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
                        <div className={`
                  p-6 rounded-xl w-[90%] max-w-md transition-all
                  ${theme === "Dark"
                                ? "bg-[#171941] text-white"
                                : "bg-white text-black shadow-2xl"
                            }
              `}>

                            {/* Header */}
                            <div className="flex justify-center items-center gap-2 mb-3">
                                <TiTick className="text-green-500 text-4xl" />
                                <h2 className="text-xl font-bold">Updated Successfully</h2>
                            </div>

                            <p className="font-semibold text-center mb-3">
                                The Operation was Successfull
                            </p>

                            {/* Details list */}
                            <ul className="mt-2 space-y-2">
                                {changeDetails.map((c, i) => (
                                    <li
                                        key={i}
                                        className={`
                                  p-3 rounded-lg flex gap-2 items-start border
                                  ${theme === "Dark"
                                                ? "bg-[#1f2250] border-[#2a2d6a]"
                                                : "bg-gray-100 border-gray-300"
                                            }
                              `}
                                    >
                                        <span className="text-green-400 font-bold mt-1">•</span>
                                        <span className="text-sm leading-5">{c}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )
            }

            {
                editItemModalFail && (
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
                            <p>The Room was not Edited</p>
                        </div>
                    </div>
                )
            }

            {
                deleteItemModalsuccess && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                        <div className={` p-6 rounded-xl 
                          
                           ${theme === "Dark"
                                ? " bg-[#171941] "
                                : " bg-white shadow-lg "
                            }`}>
                            <div className='flex justify-center'>
                                <TiTick className='text-green-600 text-4xl  ' />
                                <h2 className="text-lg font-bold mb-4">Deleted</h2>
                            </div>
                            <p>The Room was Deleted</p>
                        </div>
                    </div>
                )
            }

            {
                deleteItemModalFail && (
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
                            <p>The Room was not Deleted</p>
                        </div>
                    </div>
                )
            }


        </div>

    );
}

export default Expenses