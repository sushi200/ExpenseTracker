import React, { Fragment, useRef, useState, useContext } from "react";
import { Button, Container, Form, Card } from "react-bootstrap";
import ExpenseList from "./ExpenseList";
import { useSelector, useDispatch } from "react-redux";
import { expenseAction } from "../../../store/Expense";
import axios from "axios";

const ExpenseForm = () => {
  //firebase database URL path
  const url =
    "https://expense-tracker-909bf-default-rtdb.asia-southeast1.firebasedatabase.app";

  //firebase database URL path for update
  const updateUrl =
    "https://expense-tracker-909bf-default-rtdb.asia-southeast1.firebasedatabase.app";

  const dispatch = useDispatch();
  const expenseList = useSelector((state) => state.expense.expenseList);

  console.log(expenseList);

  //get user input
  const amountRef = useRef();
  const descRef = useRef();
  const categoryRef = useRef();
  const [isEditing, setIsEditing] = useState();

  const submitExpenseHandler = async (e) => {
    e.preventDefault();
    const expObj = {
      amount: amountRef.current.value,
      description: descRef.current.value,
      category: categoryRef.current.value,
    };
    //update expense details into firebase database
    const res = await axios.post(`${url}/expense.json`, expObj);
    console.log("res", res);

    if (res.status === 200) {
      alert("Expense stored in database successfully");
      const expense = {
        id: res.data.name,
        ...expObj,
      };
      dispatch(expenseAction.addExpense(expense));
    } else {
      alert("Error while storing expense details ");
    }
  };

  const editExpense = (expense) => {
    amountRef.current.value = expense.amount;
    descRef.current.value = expense.category;
    setIsEditing(expense.id);
  };

  const editExpenseHandler = async (e) => {
    e.preventDefault();
    const expObj = {
      id: isEditing,
      amount: amountRef.current.value,
      description: descRef.current.value,
      category: categoryRef.current.value,
    };
    const res = await axios.put(
      `${updateUrl}/expense/${expObj.id}.json`,
      expObj
    );
    if (res.status === 200) console.log("expense edited successfully");
    dispatch(expenseAction.addExpense(expObj));
    setIsEditing(false);
  };

  return (
    <Fragment>
      <Container
        style={{
          display: "flex",
          marginLeft: "15%",
          marginTop: "2%",
          padding: "30px",
        }}
      >
        <Card style={{ padding: "20px" }}>
          <Form>
            <Form.Group>
              <Form.Label>Expense Amount : </Form.Label>
              <Form.Control
                ref={amountRef}
                type="number"
                placeholder="$100"
              ></Form.Control>
              <Form.Label>Description </Form.Label>
              <Form.Control
                ref={descRef}
                type="text"
                placeholder="food"
              ></Form.Control>
              <Form.Label style={{ padding: "20px", marginLeft: "-13px" }}>
                Category
              </Form.Label>
              <select ref={categoryRef}>
                <option>Movie</option>
                <option>Fuel</option>
                <option>Groceries</option>
                <option>Bills</option>
              </select>
              {/* <DropdownButton title="Select" size="sm" ref={categoryRef}>
                <Dropdown.Item ref={categoryRef}>Movie</Dropdown.Item>
                <Dropdown.Item ref={categoryRef}>Fuel</Dropdown.Item>
                <Dropdown.Item ref={categoryRef}>Groceries</Dropdown.Item>
              </DropdownButton> */}
            </Form.Group>
            {!isEditing && (
              <Button
                style={{ padding: "5px", marginTop: "3px" }}
                type="submit"
                size="sm"
                onClick={submitExpenseHandler}
              >
                Add Expense
              </Button>
            )}
            {isEditing && (
              <Button
                style={{ padding: "5px", marginTop: "3px" }}
                type="submit"
                size="sm"
                onClick={editExpenseHandler}
              >
                Edit Expense
              </Button>
            )}
          </Form>
        </Card>
        <Card
          border="primary"
          style={{
            padding: "20px",
            height: "400px",
            width: "500px",
            marginLeft: "20px",
          }}
        >
          <ExpenseList expenses={expenseList} editExpense={editExpense} />
        </Card>
      </Container>
    </Fragment>
  );
};

export default ExpenseForm;
