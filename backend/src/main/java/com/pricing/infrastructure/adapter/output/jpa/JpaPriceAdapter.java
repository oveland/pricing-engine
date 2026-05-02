package com.pricing.infrastructure.adapter.output.jpa;

import com.pricing.domain.model.BrandId;
import com.pricing.domain.model.Price;
import com.pricing.domain.model.ProductId;
import com.pricing.domain.port.output.PriceRepositoryPort;
import com.pricing.infrastructure.mapper.PriceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class JpaPriceAdapter implements PriceRepositoryPort {
    private final SpringDataJpaRepository jpaRepository;
    private final PriceMapper priceMapper;

    @Override
    public List<Price> findByBrandIdAndProductIdAndDate(final BrandId brandId, final ProductId productId, final LocalDateTime date) {
        final List<PriceEntity> entities = jpaRepository.findByBrandIdAndProductIdAndDateBetween(
                brandId.value(), productId.value(), date);
        return entities.stream()
                .map(priceMapper::toDomain)
                .toList();
    }
}
