package com.smartinventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartinventory.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long>{

}
