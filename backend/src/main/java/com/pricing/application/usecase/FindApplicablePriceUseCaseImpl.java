package com.pricing.application.usecase;

import com.pricing.domain.exception.PriceNotFoundException;
import com.pricing.domain.model.BrandId;
import com.pricing.domain.model.Price;
import com.pricing.domain.model.ProductId;
import com.pricing.domain.port.input.FindApplicablePriceUseCase;
import com.pricing.domain.port.output.PriceRepositoryPort;
import java.time.LocalDateTime;

public class FindApplicablePriceUseCaseImpl implements FindApplicablePriceUseCase {
    private final PriceRepositoryPort priceRepository;

    public FindApplicablePriceUseCaseImpl(final PriceRepositoryPort priceRepository) {
        this.priceRepository = priceRepository;
    }

    @Override
    public Price findApplicablePrice(
            final LocalDateTime applicationDate, final ProductId productId, final BrandId brandId) {
        return priceRepository
                .findHighestPriorityPrice(brandId, productId, applicationDate)
                .orElseThrow(() -> new PriceNotFoundException(brandId, productId, applicationDate));
    }
}
