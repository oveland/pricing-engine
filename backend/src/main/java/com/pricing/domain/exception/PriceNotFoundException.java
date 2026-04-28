package com.pricing.domain.exception;

import com.pricing.domain.model.BrandId;
import com.pricing.domain.model.ProductId;

import java.time.LocalDateTime;

public class PriceNotFoundException extends RuntimeException {
    public PriceNotFoundException(BrandId brandId, ProductId productId, LocalDateTime date) {
        super(String.format(
                "No applicable price found for brandId=%d, productId=%d at %s",
                brandId.value(), productId.value(), date));
    }
}
