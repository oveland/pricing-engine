package com.pricing.domain.exception;

import com.pricing.domain.model.BrandId;
import com.pricing.domain.model.ProductId;
import java.io.Serial;
import java.time.LocalDateTime;

public class PriceNotFoundException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public PriceNotFoundException(final BrandId brandId, final ProductId productId, final LocalDateTime date) {
        super(String.format(
                "No applicable price found for brandId=%d, productId=%d at %s",
                brandId.value(), productId.value(), date));
    }
}
