package com.example.cart.web;

import com.example.cart.model.CartItem;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/cart")
@CrossOrigin
public class CartController {

    // userId -> list of cart items (simple in-memory store)
    private final Map<Long, List<CartItem>> carts = new ConcurrentHashMap<>();

    @GetMapping("/{userId}")
    public List<CartItem> getCart(@PathVariable Long userId) {
        return carts.getOrDefault(userId, new ArrayList<>());
    }

    @PostMapping("/{userId}/items")
    public List<CartItem> addItem(
            @PathVariable Long userId,
            @RequestBody CartItem item
    ) {
        List<CartItem> items = carts.computeIfAbsent(userId, id -> new ArrayList<>());
        Optional<CartItem> existing = items.stream()
                .filter(ci -> Objects.equals(ci.getProductId(), item.getProductId()))
                .findFirst();
        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + item.getQuantity());
        } else {
            items.add(new CartItem(item.getProductId(), item.getQuantity()));
        }
        return items;
    }

    @DeleteMapping("/{userId}/items/{productId}")
    public List<CartItem> removeItem(@PathVariable Long userId, @PathVariable Long productId) {
        List<CartItem> items = carts.getOrDefault(userId, new ArrayList<>());
        items.removeIf(ci -> Objects.equals(ci.getProductId(), productId));
        return items;
    }

    @DeleteMapping("/{userId}")
    public void clearCart(@PathVariable Long userId) {
        carts.remove(userId);
    }
}
