package com.pricing.application.usecase;

import com.pricing.domain.exception.PriceNotFoundException;
import com.pricing.domain.model.BrandId;
import com.pricing.domain.model.Price;
import com.pricing.domain.model.ProductId;
import com.pricing.domain.port.input.FindApplicablePriceUseCase;
import com.pricing.domain.port.output.PriceRepositoryPort;

import java.time.LocalDateTime;
import java.util.List;

public class FindApplicablePriceUseCaseImpl implements FindApplicablePriceUseCase {
    private final PriceRepositoryPort priceRepository;

    public FindApplicablePriceUseCaseImpl(PriceRepositoryPort priceRepository) {
        this.priceRepository = priceRepository;
    }

    @Override
    public Price findApplicablePrice(LocalDateTime applicationDate, ProductId productId, BrandId brandId) {
        List<Price> candidates = priceRepository.findByBrandIdAndProductIdAndDate(brandId, productId, applicationDate);

        return Price.withHighestPriority(candidates)
                .orElseThrow(() -> new PriceNotFoundException(brandId, productId, applicationDate));
    }
}
