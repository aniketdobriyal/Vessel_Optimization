import React from "react";
import { Card, Button } from "react-bootstrap";
import { Heart, ShoppingCart } from "lucide-react";

export default function Hero() {
  return (
    <>
      <style>
        {`
          .product-card{
            max-width:280px;
            border:none;
            border-radius:16px;
            overflow:hidden;
            transition:all .3s ease;
            background:#fff;
          }

          .product-card:hover{
            transform:translateY(-6px);
            box-shadow:0 12px 30px rgba(0,0,0,.12);
          }

          .product-img{
            height:190px;
            width:100%;
            object-fit:contain;
            transition:.4s;
          }

          .product-card:hover .product-img{
            transform:scale(1.08);
          }

          .wishlist-btn{
            position:absolute;
            top:12px;
            right:12px;
            background:white;
            border:none;
            width:36px;
            height:36px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            box-shadow:0 2px 8px rgba(0,0,0,.1);
          }

          .product-badge{
            position:absolute;
            top:12px;
            left:12px;
            background:#ff7b00;
            color:white;
            padding:4px 10px;
            border-radius:6px;
            font-size:12px;
            font-weight:600;
          }

          .rating{
            color:#ffb400;
            font-size:14px;
          }

          .old-price{
            text-decoration:line-through;
            color:#999;
            font-size:14px;
          }

          .discount{
            color:#28a745;
            font-weight:600;
            font-size:14px;
          }

          .cart-btn{
            border-radius:10px;
            font-weight:600;
          }

          body{
            background:#f5f6fa;
          }
        `}
      </style>

      <div className="d-flex justify-content-center p-5">
        <Card className="product-card shadow-sm">
          <div className="position-relative p-3">
            <span className="product-badge">
              Bestseller
            </span>

            <button className="wishlist-btn">
              <Heart size={18} />
            </button>

            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
              alt="Running Shoes"
              className="product-img"
            />
          </div>

          <Card.Body>
            <h6 className="fw-bold mb-1">
              Nike Air Zoom Runner
            </h6>

            <small className="text-muted d-block mb-2">
              Lightweight Running Shoes
            </small>

            <div className="rating mb-2">
              ⭐⭐⭐⭐⭐
              <span className="text-muted ms-1">
                4.8 (3.2K Reviews)
              </span>
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="fw-bold fs-5">
                ₹2,499
              </span>

              <span className="old-price">
                ₹4,499
              </span>

              <span className="discount">
                44% OFF
              </span>
            </div>

            <Button
              variant="outline-primary"
              className="w-100 cart-btn"
            >
              <ShoppingCart
                size={18}
                className="me-2"
              />
              Add to Cart
            </Button>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}