package com.pricing.infrastructure.adapter.output.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SpringDataJpaRepository extends JpaRepository<PriceEntity, Long> {
    @Query("SELECT p FROM PriceEntity p WHERE p.brandId = :brandId AND p.productId = :productId " +
           "AND :date BETWEEN p.startDate AND p.endDate")
    List<PriceEntity> findByBrandIdAndProductIdAndDateBetween(
            @Param("brandId") Long brandId,
            @Param("productId") Long productId,
            @Param("date") LocalDateTime date);
}
