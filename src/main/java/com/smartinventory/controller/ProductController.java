package com.smartinventory.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartinventory.dto.ProductResponse;
import com.smartinventory.entity.Product;
import com.smartinventory.service.ProductService;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productService.getAllProducts();

        return products.stream()
                .map(ProductResponse::from)
                .toList();
    }
}
