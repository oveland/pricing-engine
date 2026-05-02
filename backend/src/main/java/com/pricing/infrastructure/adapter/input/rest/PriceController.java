package com.pricing.infrastructure.adapter.input.rest;

import com.pricing.domain.model.BrandId;
import com.pricing.domain.model.Price;
import com.pricing.domain.model.ProductId;
import com.pricing.domain.port.input.FindApplicablePriceUseCase;
import com.pricing.infrastructure.mapper.PriceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/prices")
@RequiredArgsConstructor
public class PriceController {
    private final FindApplicablePriceUseCase priceUseCase;
    private final PriceMapper priceMapper;

    @GetMapping
    public ResponseEntity<PriceResponseDto> findApplicablePrice(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) final LocalDateTime date,
            @RequestParam final Long productId,
            @RequestParam final Long brandId) {
        final Price price = priceUseCase.findApplicablePrice(
                date, new ProductId(productId), new BrandId(brandId));

        return ResponseEntity.ok(priceMapper.toResponseDto(price));
    }
}
