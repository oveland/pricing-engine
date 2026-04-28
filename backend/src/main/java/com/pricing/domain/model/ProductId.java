package com.pricing.domain.model;

import java.util.Objects;

public record ProductId(Long value) {
    public ProductId {
        Objects.requireNonNull(value, "productId must not be null");
        if (value <= 0) {
            throw new IllegalArgumentException("productId must be positive");
        }
    }
}
