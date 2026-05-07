package com.pricing.domain.port.output;

import com.pricing.domain.model.BrandId;
import com.pricing.domain.model.Price;
import com.pricing.domain.model.ProductId;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PriceRepositoryPort {

    List<Price> findByBrandIdAndProductIdAndDate(BrandId brandId, ProductId productId, LocalDateTime applicationDate);

    Optional<Price> findHighestPriorityPrice(BrandId brandId, ProductId productId, LocalDateTime applicationDate);
}
