package com.pricing.domain.port.input;

import com.pricing.domain.model.BrandId;
import com.pricing.domain.model.Price;
import com.pricing.domain.model.ProductId;

import java.time.LocalDateTime;

public interface FindApplicablePriceUseCase {
    
    Price findApplicablePrice(LocalDateTime applicationDate, ProductId productId, BrandId brandId);
}
