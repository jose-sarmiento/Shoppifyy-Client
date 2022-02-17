import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
    regions,
    provinces,
    cities,
    barangays,
} from "select-philippines-address";
import { updateUser } from "../store/users";

const AddressForm = () => {
    const dispatch = useDispatch();

    const {user} = useSelector(state => state.users)

    const [regionData, setRegionData] = useState([]);
    const [provinceData, setProvinceData] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [barangayData, setBarangayData] = useState([]);

    const [address, setAddress] = useState({
        region: { code: "", name: "" },
        province: { code: "", name: "" },
        city: { code: "", name: "" },
        barangay: { code: "", name: "" },
        street: "",
        houseNumber: "",
    });
    const [phone, setPhone] = useState(user.phone || "")

    useEffect(() => {
        const getRegions = async () => {
            const res = await regions();
            setRegionData(res);
        };
        getRegions();
    }, []);

    const handleRegionChange = async (e) => {
        const { value, options, selectedIndex } = e.target;
        if (value === "") return;
        if (address.region.code !== value) {
            setAddress({
                province: { code: "", name: "" },
                city: { code: "", name: "" },
                barangay: { code: "", name: "" },
                street: "",
                houseNumber: "",
            });
        }
        setAddress({
            ...address,
            region: {
                code: value,
                name: options[selectedIndex].text.trim(),
            },
        });

        const res = await provinces(value);
        setProvinceData(res);
    };

    const handleProvinceChange = async (e) => {
        const { value, options, selectedIndex } = e.target;
        if (value === "") return;
        if (address.province.code !== value) {
            setAddress({
                city: { code: "", name: "" },
                barangay: { code: "", name: "" },
                street: "",
                houseNumber: "",
            });
        }
        setAddress({
            ...address,
            province: {
                code: value,
                name: options[selectedIndex].text.trim(),
            },
        });

        const res = await cities(value);
        setCityData(res);
    };

    const handleCityChange = async (e) => {
        const { value, options, selectedIndex } = e.target;
        if (value === "") return;
        if (address.city.code !== value) {
            setAddress({
                barangay: { code: "", name: "" },
                street: "",
                houseNumber: "",
            });
        }
        setAddress({
            ...address,
            city: {
                code: value,
                name: options[selectedIndex].text.trim(),
            },
        });

        const res = await barangays(value);
        setBarangayData(res);
    };

    const handleBarangayChange = async (e) => {
        const { value, options, selectedIndex } = e.target;
        if (value === "") return;
        setAddress({
            ...address,
            barangay: {
                code: value,
                name: options[selectedIndex].text.trim(),
            },
        });
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        dispatch(
            updateUser({
                address: {
                    region: address.region.name,
                    province: address.province.name,
                    city: address.city.name,
                    barangay: address.barangay.name,
                    street: address.street,
                    houseNumber: address.houseNumber,
                },
                phone: phone,
            })
        );
    };
    return (
        <Form onSubmit={handleAddressSubmit} className="mt-5">
            <Form.Group controlId="region" className="mb-2">
                <Form.Label className="shipping-form-label">Region</Form.Label>
                <Form.Control
                    size="sm"
                    as="select"
                    onChange={handleRegionChange}
                    value={address.region.code}
                    required
                >
                    <option value="" disabled>
                        Select Region
                    </option>
                    {regionData &&
                        regionData.length > 0 &&
                        regionData.map((item) => (
                            <option
                                key={item.region_code}
                                value={item.region_code}
                            >
                                {item.region_name}
                            </option>
                        ))}
                </Form.Control>
                {address?.region.code === "" && (
                    <Form.Text className="text-danger">
                        Region is required
                    </Form.Text>
                )}
            </Form.Group>

            <Form.Group controlId="province" className="mb-2">
                <Form.Label className="shipping-form-label">
                    Province
                </Form.Label>
                <Form.Control
                    size="sm"
                    as="select"
                    onChange={handleProvinceChange}
                    value={address.province.code}
                    required
                >
                    <option value="" disabled>
                        Select Province
                    </option>
                    {provinceData &&
                        provinceData.length > 0 &&
                        provinceData.map((item) => (
                            <option
                                key={item.province_code}
                                value={item.province_code}
                            >
                                {item.province_name}
                            </option>
                        ))}
                </Form.Control>
                {address?.province.code === "" && (
                    <Form.Text className="text-danger">
                        Province is required
                    </Form.Text>
                )}
            </Form.Group>

            <Form.Group controlId="city" className="mb-2">
                <Form.Label className="shipping-form-label">City</Form.Label>
                <Form.Control
                    size="sm"
                    as="select"
                    onChange={handleCityChange}
                    value={address.city.code}
                    required
                >
                    <option value="" disabled>
                        Select City
                    </option>
                    {cityData &&
                        cityData.length > 0 &&
                        cityData.map((item) => (
                            <option key={item.city_code} value={item.city_code}>
                                {item.city_name}
                            </option>
                        ))}
                </Form.Control>
                {address?.city.code === "" && (
                    <Form.Text className="text-danger">
                        City is required
                    </Form.Text>
                )}
            </Form.Group>

            <Form.Group controlId="barangay" className="mb-2">
                <Form.Label className="shipping-form-label">
                    Barangay
                </Form.Label>
                <Form.Control
                    size="sm"
                    as="select"
                    onChange={handleBarangayChange}
                    value={address.barangay.code}
                    required
                >
                    <option value="" disabled>
                        Select barangay
                    </option>
                    {barangayData &&
                        barangayData.length > 0 &&
                        barangayData.map((item) => (
                            <option key={item.brgy_code} value={item.brgy_code}>
                                {item.brgy_name}
                            </option>
                        ))}
                </Form.Control>
                {address?.barangay.code === "" && (
                    <Form.Text className="text-danger">
                        Barangay is required
                    </Form.Text>
                )}
            </Form.Group>

            <Form.Group controlId="street" className="mb-2">
                <Form.Label className="shipping-form-label">Street</Form.Label>
                <Form.Control
                    size="sm"
                    type="text"
                    name="street"
                    onChange={(e) => {
                        setAddress({ ...address, street: e.target.value });
                    }}
                    value={address.street}
                    required
                ></Form.Control>
                {address?.street === "" && (
                    <Form.Text className="text-danger">
                        Street is required
                    </Form.Text>
                )}
            </Form.Group>

            <Form.Group controlId="house-number" className="mb-2">
                <Form.Label className="shipping-form-label">
                    House number
                </Form.Label>
                <Form.Control
                    size="sm"
                    type="text"
                    name="houseNumber"
                    onChange={(e) =>
                        setAddress({ ...address, houseNumber: e.target.value })
                    }
                    value={address.houseNumber}
                    required
                ></Form.Control>
                {address.houseNumber === "" && (
                    <Form.Text className="text-danger">
                        House number is required
                    </Form.Text>
                )}
            </Form.Group>

            <Form.Group controlId="phone" className="mb-2">
                <Form.Label className="shipping-form-label">
                    Cp #
                </Form.Label>
                <Form.Control
                    size="sm"
                    type="text"
                    name="phone"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                    required
                ></Form.Control>
                {phone === "" && (
                    <Form.Text className="text-danger">
                        Phone number is required
                    </Form.Text>
                )}
            </Form.Group>

            <Button type="submit" variant="primary" className="mb-3 btn-sm">
                Save
            </Button>
        </Form>
    );
};

export default AddressForm;
