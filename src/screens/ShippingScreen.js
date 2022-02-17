import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FaPhone, FaMapMarkerAlt } from "react-icons/fa";

import {
    FormContainer,
    Loader,
    CheckoutSteps,
    AddressForm,
} from "../components";

const ShippingScreen = () => {
    const history = useHistory();

    const { user, loading_user, loading_update, success_update } = useSelector(
        (state) => state.users
    );

    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (success_update) setEditMode(false);
    }, [success_update]);

    const continueToNext = () => {
        if(user.address && user.phone) {
            history.push("/payment")
        }
    }

    if (loading_user || loading_update)
        return (
            <Container>
                <Loader />
            </Container>
        );

    return (
        <div className="container">
            <h1>Shipping</h1>
            <CheckoutSteps step1 step2 />

            <FormContainer>
                <div className="container" style={{ textAlign: "right" }}>
                    <Button
                        className="btn-sm"
                        onClick={() => setEditMode((prev) => !prev)}
                    >
                        {editMode ? "Cancel" : "Edit"}
                    </Button>
                </div>
                <h4>Address</h4>
                {user && user.address ? (
                    <h6 style={{ display: "flex", alignItems: "center" }}>
                        <FaMapMarkerAlt
                            style={{ fontSize: ".8rem", marginRight: ".5rem" }}
                        />
                        {`${user.address.houseNumber} ${user.address.street}, ${user.address.barangay} ${user.address.city}, ${user.address.province}`}
                    </h6>
                ) : (
                    "add address"
                )}
                <hr />
                <h4>Contact</h4>
                <h6 style={{ display: "flex", alignItems: "center" }}>
                    <FaPhone
                        style={{ fontSize: ".8rem", marginRight: ".5rem" }}
                    />
                    {user && user.phone ? user.phone : "add contact"}
                </h6>

                {editMode && <AddressForm />}
            </FormContainer>

            <div className="container" style={{ textAlign: "right" }}>
                {!editMode && (
                    <Button
                        className="bg-primary"
                        disabled={!user?.address && !user?.phone}
                        onClick={continueToNext}
                    >
                        Continue
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ShippingScreen;
