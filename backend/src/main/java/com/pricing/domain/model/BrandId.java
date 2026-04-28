package com.pricing.domain.model;

import java.util.Objects;

public record BrandId(Long value) {
    public BrandId {
        Objects.requireNonNull(value, "brandId must not be null");
        if (value <= 0) {
            throw new IllegalArgumentException("brandId must be positive");
        }
    }
}
