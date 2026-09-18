export default function About() {
  return (
    <section className="page">
      <p className="kicker">Our story</p>
      <h1 className="display" style={{ fontSize: 64 }}>Crafted with Care</h1>
      <p style={{ maxWidth: 640 }}>Tanvi Loops began as evening stitches on a quiet table. Every tote, bloom, and bear is worked by hand in small batches.</p>
      <p style={{ maxWidth: 640 }}>Handmade means the tension changes with the day. That irregularity is the point.</p>
      <div className="grid" style={{ marginTop: 32 }}>
        <img src="/products/flower-red.jpg" alt="" style={{ borderRadius: 24 }} />
        <img src="/products/bag-green-flowers.jpg" alt="" style={{ borderRadius: 24 }} />
        <img src="/products/teddy-pair.jpg" alt="" style={{ borderRadius: 24 }} />
      </div>
    </section>
  )
}
