package com.pricing.infrastructure.adapter.input.rest;

import java.math.BigDecimal;

public record PriceResponseDto(
        Long productId,
        Long brandId,
        Integer priceList,
        String startDate,
        String endDate,
        BigDecimal price,
        String currency) {}
