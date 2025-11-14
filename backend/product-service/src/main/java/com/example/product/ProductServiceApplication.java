package com.example.product;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.product.entity.Product;
import com.example.product.repo.ProductRepository;

import java.math.BigDecimal;

@SpringBootApplication
public class ProductServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(ProductRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(new Product("Laptop", "High performance laptop", new BigDecimal("1299.99"), 10));
                repo.save(new Product("Phone", "Flagship smartphone", new BigDecimal("899.99"), 25));
                repo.save(new Product("Headphones", "Noise cancelling headphones", new BigDecimal("199.99"), 50));
            }
        };
    }
}
