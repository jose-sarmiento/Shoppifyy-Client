import { render, screen } from "@testing-library/react"
import Product from "./Product"

test("button must be disabled when out of stock", () => {
	render(<Product product={{_id: "1"}} />)
})