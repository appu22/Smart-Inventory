package com.smartinventory.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.smartinventory.entity.Product;

public record ProductResponse(Long id, String name, String sku, String description, BigDecimal price, Integer quantity,
		LocalDateTime createdAt) {

	public static ProductResponse from(Product product) {
		return new ProductResponse(product.getId(), product.getName(), product.getSku(), product.getDescription(),
				product.getPrice(), product.getQuantity(), product.getCreatedAt());
	}
}